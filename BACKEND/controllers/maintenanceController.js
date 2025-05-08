import validator from "validator";
import maintenanceModel from "../models/maintenanceModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Chart, registerables } from 'chart.js';

// Load environment variables
dotenv.config();

// Log email configuration (without sensitive data)
console.log('Email configuration:', {
    host: 'smtp.gmail.com',
    port: 587,
    user: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
    pass: process.env.EMAIL_PASS ? 'Configured' : 'Not configured'
});

// Configure nodemailer with secure settings
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Email configuration error:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Register Chart.js components
Chart.register(...registerables);

const addForm = async (req, res) => {
    try {
        console.log('Starting addForm function...');
        
        // Handle multer errors
        if (req.fileValidationError) {
            console.log('Multer validation error:', req.fileValidationError);
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }

        const { name, phone, email, houseNo, category, details, priority } = req.body;
        const imageFile = req.file;

        console.log('Received request:', {
            body: req.body,
            file: imageFile ? {
                filename: imageFile.filename,
                path: imageFile.path,
                size: imageFile.size
            } : 'No file'
        });

        // Validate required fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            console.log('Missing required fields:', { name, phone, email, houseNo, category, details, priority });
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            console.log('Invalid email:', email);
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            console.log('Invalid phone number:', phone);
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }

        // Validate house number format (alphanumeric)
        const houseNoRegex = /^[A-Za-z0-9]+$/;
        if (!houseNoRegex.test(houseNo)) {
            return res.status(400).json({ message: 'House number must be alphanumeric' });
        }

        let imageUrl = null;
        if (imageFile) {
            try {
                console.log('Attempting to upload to Cloudinary...');
                console.log('Cloudinary config:', {
                    cloud_name: process.env.CLOUDINARY_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    has_secret: !!process.env.CLOUDINARY_SECRET_KEY
                });
                
                const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                    folder: "maintenance_requests",
                });
                console.log('Cloudinary upload successful:', uploadResponse.secure_url);
                imageUrl = uploadResponse.secure_url;

                // Delete the temporary file after successful upload
                fs.unlink(imageFile.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Delete the temporary file if upload fails
                fs.unlink(imageFile.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image",
                    error: uploadError.message 
                });
            }
        }

        // Create new maintenance request
        const newRequest = new maintenanceModel({
            name,
            phone: parseInt(phone, 10),
            email,
            houseNo,
            category,
            details,
            priority,
            images: imageUrl,
            date: new Date()
        });

        await newRequest.save();
        console.log('Maintenance request saved successfully');

        res.status(201).json({ success: true, message: "Request added successfully" });
    } catch (error) {
        console.error('Error in addForm:', error);
        console.error('Error stack:', error.stack);
        
        // Handle specific error types
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false, 
                message: "A request with this email already exists",
                error: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Internal server error",
                error: error.message 
            });
        }
    }
};


const displayAllMaintainRequests = async (req, res) => {
    try {
        const AllMaintainanceRequests = await maintenanceModel.find().select('+status +rejectionReason');
        console.log('Found maintenance requests:', AllMaintainanceRequests.map(req => ({
            id: req._id,
            status: req.status,
            rejectionReason: req.rejectionReason
        })));
        return res.status(200).json({ success: true, AllMaintainanceRequests });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const MaintenanceRequest = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const maintenanceRequest = await maintenanceModel.findById(maintenanceId)
        return res.status(200).json({ success: true, maintenanceRequest });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update
const updateForm = async (req, res) => {
    try {
        const maintenanceId = req.params.id;

        // Log received data
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { name, phone, email, houseNo, category, details, priority, status, rejectionReason } = req.body;

        // Get the current maintenance request
        const currentRequest = await maintenanceModel.findById(maintenanceId);
        if (!currentRequest) {
            return res.status(404).json({ success: false, message: 'Maintenance request not found' });
        }

        // If this is a rejection update
        if (status === 'rejected') {
            if (!rejectionReason) {
                return res.status(400).json({ success: false, message: 'Rejection reason is required' });
            }

            const updatedRequest = await maintenanceModel.findByIdAndUpdate(
                maintenanceId,
                {
                    status: 'rejected',
                    rejectionReason,
                    updatedAt: Date.now()
                },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: 'Request rejected successfully',
                maintenanceRequest: updatedRequest
            });
        }

        // For regular updates, validate required fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: 'Cannot update, Missing required fields' });
        }

        // Handle image upload
        let imageUrl = currentRequest.images; // Keep existing image by default
        if (req.file) {
            try {
                console.log('Uploading new image to Cloudinary...');
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'maintenance_requests',
                });
                console.log('Cloudinary upload successful:', uploadResponse.secure_url);
                imageUrl = uploadResponse.secure_url;

                // Delete the temporary file after successful upload
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Delete the temporary file if upload fails
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image",
                    error: uploadError.message 
                });
            }
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }

        const updatedData = {
            name,
            phone,
            email,
            houseNo,
            category,
            details,
            priority,
            images: imageUrl // Always include the image URL (either new or existing)
        };

        // Update the maintenance request
        const updatedRequest = await maintenanceModel.findByIdAndUpdate(
            maintenanceId, 
            updatedData, 
            { new: true }
        );

        console.log('Updated maintenance request:', updatedRequest);

        return res.status(200).json({ 
            success: true, 
            message: 'Maintenance details updated successfully',
            maintenanceRequest: updatedRequest
        });
    } catch (error) {
        console.error('Error in updateForm:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



const deleteMaintenanceRequest = async (req, res) => {

    try {
        const maintenanceId = req.params.id;
        await maintenanceModel.findByIdAndDelete(maintenanceId)
        return res.json({ success: true, message: "Maintenance request deleted successfully" });

    } catch (error) {
        return res.json({ success: false, massage: error.massage })
    }
}

// Reject maintenance request
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    console.log('Rejecting request:', { id, rejectionReason });

    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    // Find the request first to ensure it exists
    const request = await maintenanceModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    console.log('Current request status:', request.status);

    // Update the request with rejection status and reason
    const updatedRequest = await maintenanceModel.findByIdAndUpdate(
      id,
      { 
        $set: {
          status: 'rejected',
          rejectionReason: rejectionReason,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    console.log('Updated request:', {
      id: updatedRequest._id,
      status: updatedRequest.status,
      rejectionReason: updatedRequest.rejectionReason
    });

    if (!updatedRequest) {
      return res.status(500).json({ success: false, message: 'Failed to update request' });
    }

    // Send rejection email
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedRequest.email,
        subject: 'Maintenance Request Update',
        html: `
          <h1>Maintenance Request Update</h1>
          <p>Dear ${updatedRequest.name},</p>
          <p>We regret to inform you that your maintenance request has been rejected.</p>
          <p>Request Details:</p>
          <ul>
            <li>Category: ${updatedRequest.category}</li>
            <li>Priority: ${updatedRequest.priority}</li>
            <li>Description: ${updatedRequest.details}</li>
            <li>Date Submitted: ${new Date(updatedRequest.date).toLocaleDateString()}</li>
          </ul>
          <p><strong>Reason for Rejection:</strong></p>
          <p>${rejectionReason}</p>
          <p>If you have any questions, please contact us.</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Rejection email sent successfully');
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ success: false, message: 'Error rejecting request', error: error.message });
  }
};

// Accept maintenance request
const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    console.log('Accepting request:', { id });

    // Find the request first to ensure it exists
    const request = await maintenanceModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

    console.log('Current request status:', request.status);

    // Update the request with accepted status
    const updatedRequest = await maintenanceModel.findByIdAndUpdate(
      id,
      { 
        $set: {
          status: 'accepted',
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    );

    console.log('Updated request:', {
      id: updatedRequest._id,
      status: updatedRequest.status
    });

    if (!updatedRequest) {
      return res.status(500).json({ success: false, message: 'Failed to update request' });
    }

    // Send acceptance email
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials not configured');
        throw new Error('Email credentials not configured');
      }

      const mailOptions = {
        from: `"Communet Maintenance" <${process.env.EMAIL_USER}>`,
        to: updatedRequest.email,
        subject: 'Maintenance Request Accepted',
        html: `
          <h1>Maintenance Request Update</h1>
          <p>Dear ${updatedRequest.name},</p>
          <p>Your maintenance request has been accepted.</p>
          <p>Request Details:</p>
          <ul>
            <li>Category: ${updatedRequest.category}</li>
            <li>Priority: ${updatedRequest.priority}</li>
            <li>Description: ${updatedRequest.details}</li>
            <li>Date Submitted: ${new Date(updatedRequest.date).toLocaleDateString()}</li>
          </ul>
          <p>Our team will contact you shortly to schedule the maintenance work.</p>
          <p>Thank you for your patience.</p>
        `
      };

      console.log('Attempting to send email to:', updatedRequest.email);
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (emailError) {
      console.error('Error sending acceptance email:', {
        error: emailError.message,
        code: emailError.code,
        command: emailError.command
      });
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ success: false, message: 'Error accepting request', error: error.message });
  }
};

// Generate maintenance report
const generateReport = async (req, res) => {
  try {
    // Fetch all maintenance requests
    const requests = await maintenanceModel.find().sort({ date: -1 });

    // Create a new PDF document
    const doc = new PDFDocument();
    const filename = `maintenance_report_${new Date().toISOString().split('T')[0]}.pdf`;

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text('Maintenance Requests Report', { align: 'center' });
    doc.moveDown();

    // Add date
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown();

    // Calculate statistics
    const totalRequests = requests.length;
    const acceptedRequests = requests.filter(req => req.status === 'accepted').length;
    const rejectedRequests = requests.filter(req => req.status === 'rejected').length;
    const pendingRequests = requests.filter(req => req.status === 'pending').length;

    // Calculate category statistics
    const categoryStats = {};
    requests.forEach(request => {
      categoryStats[request.category] = (categoryStats[request.category] || 0) + 1;
    });

    // Calculate house number statistics
    const houseNoStats = {};
    requests.forEach(request => {
      houseNoStats[request.houseNo] = (houseNoStats[request.houseNo] || 0) + 1;
    });

    // Find most common category and house number
    const mostCommonCategory = Object.entries(categoryStats)
      .sort((a, b) => b[1] - a[1])[0];
    const mostCommonHouseNo = Object.entries(houseNoStats)
      .sort((a, b) => b[1] - a[1])[0];

    // Add summary
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12)
      .text(`Total Requests: ${totalRequests}`)
      .text(`Accepted Requests: ${acceptedRequests}`)
      .text(`Rejected Requests: ${rejectedRequests}`)
      .text(`Pending Requests: ${pendingRequests}`)
      .text(`Most Common Category: ${mostCommonCategory[0]} (${mostCommonCategory[1]} requests)`)
      .text(`Most Common House Number: ${mostCommonHouseNo[0]} (${mostCommonHouseNo[1]} requests)`);
    doc.moveDown();

    // Create charts
    const width = 600;
    const height = 400;
    const chartCallback = (ChartJS) => {
      ChartJS.defaults.responsive = true;
      ChartJS.defaults.maintainAspectRatio = false;
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    // Generate category pie chart
    const categoryChartConfig = {
      type: 'pie',
      data: {
        labels: Object.keys(categoryStats),
        datasets: [{
          data: Object.values(categoryStats),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Request Categories Distribution'
          }
        }
      }
    };

    // Generate house number bar chart
    const houseNoChartConfig = {
      type: 'bar',
      data: {
        labels: Object.keys(houseNoStats),
        datasets: [{
          label: 'Number of Requests',
          data: Object.values(houseNoStats),
          backgroundColor: '#36A2EB',
          borderColor: '#2196F3',
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Requests by House Number',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Requests: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Requests',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            ticks: {
              stepSize: 1,
              precision: 0
            }
          },
          x: {
            title: {
              display: true,
              text: 'House Numbers',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            ticks: {
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 45,
              padding: 10
            },
            grid: {
              display: false
            }
          }
        },
        layout: {
          padding: {
            bottom: 20
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 2000
        }
      }
    };

    // Generate chart images
    const categoryChartImage = await chartJSNodeCanvas.renderToBuffer(categoryChartConfig);
    const houseNoChartImage = await chartJSNodeCanvas.renderToBuffer(houseNoChartConfig);

    // Save chart images temporarily
    const categoryChartPath = 'category_chart.png';
    const houseNoChartPath = 'house_no_chart.png';
    fs.writeFileSync(categoryChartPath, categoryChartImage);
    fs.writeFileSync(houseNoChartPath, houseNoChartImage);

    // Add charts to PDF
    doc.fontSize(14).text('Request Categories Distribution', { underline: true });
    doc.moveDown();
    doc.image(categoryChartPath, {
      fit: [500, 300],
      align: 'center'
    });
    doc.moveDown();

    doc.fontSize(14).text('Requests by House Number', { underline: true });
    doc.moveDown();
    doc.image(houseNoChartPath, {
      fit: [500, 300],
      align: 'center'
    });
    doc.moveDown();

    // Clean up temporary files
    fs.unlinkSync(categoryChartPath);
    fs.unlinkSync(houseNoChartPath);

    // Add detailed request information
    doc.fontSize(14).text('Detailed Request Information', { underline: true });
    doc.moveDown();

    requests.forEach((request, index) => {
      doc.fontSize(12)
        .text(`Request #${index + 1}`, { underline: true })
        .text(`Name: ${request.name}`)
        .text(`Email: ${request.email}`)
        .text(`Phone: ${request.phone}`)
        .text(`House Number: ${request.houseNo}`)
        .text(`Category: ${request.category}`)
        .text(`Priority: ${request.priority}`)
        .text(`Status: ${request.status}`)
        .text(`Date: ${new Date(request.date).toLocaleDateString()}`)
        .text(`Description: ${request.details}`);

      if (request.status === 'rejected' && request.rejectionReason) {
        doc.text(`Rejection Reason: ${request.rejectionReason}`);
      }

      doc.moveDown();
    });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Error generating report', error: error.message });
  }
};

export { addForm, displayAllMaintainRequests, MaintenanceRequest, updateForm, deleteMaintenanceRequest, rejectRequest, acceptRequest, generateReport };
