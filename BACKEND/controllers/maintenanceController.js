import validator from "validator";
import maintenanceModel from "../models/maintenanceModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import Chart from 'chart.js/auto';

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify email configuration
const verifyEmailConfig = async () => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            return false;
        }
        await transporter.verify();
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
};

// Call verification on startup
verifyEmailConfig();

const addForm = async (req, res) => {
    try {
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }

        const { name, phone, email, houseNo, category, details, priority } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }

        let imageUrl = null;
        if (imageFile) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                    folder: "maintenance_requests",
                });
                imageUrl = uploadResponse.secure_url;

                fs.unlink(imageFile.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            } catch (uploadError) {
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

        const newRequest = new maintenanceModel({
            name,
            phone: parseInt(phone, 10),
            email,
            houseNo: parseInt(houseNo, 10),
            category,
            details,
            priority,
            images: imageUrl,
            date: new Date()
        });

        await newRequest.save();
        res.status(201).json({ success: true, message: "Request added successfully" });
    } catch (error) {
        console.error('Error in addForm:', error);
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
        return res.status(200).json({ success: true, AllMaintainanceRequests });
    } catch (error) {
        console.error('Error in displayAllMaintainRequests:', error);
        res.json({ success: false, message: error.message });
    }
}

const MaintenanceRequest = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const maintenanceRequest = await maintenanceModel.findById(maintenanceId)
        return res.status(200).json({ success: true, maintenanceRequest });
    } catch (error) {
        console.error('Error in MaintenanceRequest:', error);
        res.json({ success: false, message: error.message });
    }
}

const updateForm = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const { name, phone, email, houseNo, category, details, priority, status, rejectionReason } = req.body;

        const currentRequest = await maintenanceModel.findById(maintenanceId);
        if (!currentRequest) {
            return res.status(404).json({ success: false, message: 'Maintenance request not found' });
        }

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

        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: 'Cannot update, Missing required fields' });
        }

        let imageUrl = currentRequest.images;
        if (req.file) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'maintenance_requests',
                });
                imageUrl = uploadResponse.secure_url;

                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            } catch (uploadError) {
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
            images: imageUrl
        };

        const updatedRequest = await maintenanceModel.findByIdAndUpdate(
            maintenanceId, 
            updatedData, 
            { new: true }
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Maintenance details updated successfully',
            maintenanceRequest: updatedRequest
        });
    } catch (error) {
        console.error('Error in updateForm:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const deleteMaintenanceRequest = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        await maintenanceModel.findByIdAndDelete(maintenanceId)
        return res.json({ success: true, message: "Maintenance request deleted successfully" });
    } catch (error) {
        console.error('Error in deleteMaintenanceRequest:', error);
        return res.json({ success: false, message: error.message });
    }
}

const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const request = await maintenanceModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

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

    if (!updatedRequest) {
      return res.status(500).json({ success: false, message: 'Failed to update request' });
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: request.email,
        subject: 'Maintenance Request Rejected',
        html: `
          <h2>Your Maintenance Request Has Been Rejected</h2>
          <p>Dear ${request.name},</p>
          <p>Your maintenance request has been rejected. Here are the details:</p>
          <ul>
            <li><strong>House Number:</strong> ${request.houseNo}</li>
            <li><strong>Category:</strong> ${request.category}</li>
            <li><strong>Priority:</strong> ${request.priority}</li>
            <li><strong>Description:</strong> ${request.details}</li>
            <li><strong>Rejection Reason:</strong> ${rejectionReason}</li>
          </ul>
          <p>If you have any questions or concerns, please contact the maintenance team.</p>
          <br>
          <p>Best regards,</p>
          <p>Maintenance Team</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending rejection email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Request rejected successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error rejecting request', 
      error: error.message 
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await maintenanceModel.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Maintenance request not found' });
    }

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

    if (!updatedRequest) {
      return res.status(500).json({ success: false, message: 'Failed to update request' });
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: request.email,
        subject: 'Maintenance Request Accepted',
        html: `
          <h2>Your Maintenance Request Has Been Accepted</h2>
          <p>Dear ${request.name},</p>
          <p>Your maintenance request has been accepted. Here are the details:</p>
          <ul>
            <li><strong>House Number:</strong> ${request.houseNo}</li>
            <li><strong>Category:</strong> ${request.category}</li>
            <li><strong>Priority:</strong> ${request.priority}</li>
            <li><strong>Description:</strong> ${request.details}</li>
          </ul>
          <p>Our team will contact you shortly to schedule the maintenance work.</p>
          <p>Thank you for your patience.</p>
          <br>
          <p>Best regards,</p>
          <p>Maintenance Team</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending acceptance email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      request: updatedRequest
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error accepting request', 
      error: error.message 
    });
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

    // Calculate category distribution
    const categoryCount = {};
    requests.forEach(req => {
      categoryCount[req.category] = (categoryCount[req.category] || 0) + 1;
    });
    const mostCommonCategory = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])[0];

    // Calculate house number distribution
    const houseNoCount = {};
    requests.forEach(req => {
      houseNoCount[req.houseNo] = (houseNoCount[req.houseNo] || 0) + 1;
    });
    const mostCommonHouseNo = Object.entries(houseNoCount)
      .sort((a, b) => b[1] - a[1])[0];

    // Generate pie chart for categories
    const width = 400;
    const height = 400;
    const chartCallback = (ChartJS) => {
      ChartJS.defaults.color = '#000000';
      ChartJS.defaults.font.family = 'Arial';
    };

    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    // Category Pie Chart
    const categoryData = {
      labels: Object.keys(categoryCount),
      datasets: [{
        data: Object.values(categoryCount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };

    const categoryConfig = {
      type: 'pie',
      data: categoryData,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Maintenance Requests by Category',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'right',
            labels: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    };

    // House Number Bar Chart
    const houseNoData = {
      labels: Object.keys(houseNoCount).map(no => `House ${no}`),
      datasets: [{
        label: 'Number of Requests',
        data: Object.values(houseNoCount),
        backgroundColor: '#36A2EB',
        borderColor: '#2196F3',
        borderWidth: 1
      }]
    };

    const houseNoConfig = {
      type: 'bar',
      data: houseNoData,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Maintenance Requests by House Number',
            font: {
              size: 16
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Requests'
            }
          },
          x: {
            title: {
              display: true,
              text: 'House Numbers'
            }
          }
        }
      }
    };

    // Generate both chart images
    const categoryChartImage = await chartJSNodeCanvas.renderToBuffer(categoryConfig);
    const houseNoChartImage = await chartJSNodeCanvas.renderToBuffer(houseNoConfig);

    // Add summary
    doc.fontSize(14).text('Summary', { underline: true });
    doc.fontSize(12)
      .text(`Total Requests: ${totalRequests}`)
      .text(`Accepted Requests: ${acceptedRequests}`)
      .text(`Rejected Requests: ${rejectedRequests}`)
      .text(`Pending Requests: ${pendingRequests}`)
      .moveDown()
      .text(`Most Common Category: ${mostCommonCategory[0]} (${mostCommonCategory[1]} requests)`)
      .text(`Most Common House Number: ${mostCommonHouseNo[0]} (${mostCommonHouseNo[1]} requests)`);
    doc.moveDown();

    // Add category distribution with pie chart
    doc.fontSize(14).text('Category Distribution', { underline: true });
    doc.moveDown();
    
    // Add the pie chart to the PDF
    doc.image(categoryChartImage, {
      fit: [400, 400],
      align: 'center'
    });
    doc.moveDown();

    // Add category details
    Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([category, count]) => {
        doc.fontSize(12).text(`${category}: ${count} requests`);
      });
    doc.moveDown();

    // Add house number distribution with bar chart
    doc.fontSize(14).text('House Number Distribution', { underline: true });
    doc.moveDown();
    
    // Add the bar chart to the PDF
    doc.image(houseNoChartImage, {
      fit: [400, 400],
      align: 'center'
    });
    doc.moveDown();

    // Add house number details
    Object.entries(houseNoCount)
      .sort((a, b) => b[1] - a[1])
      .forEach(([houseNo, count]) => {
        doc.fontSize(12).text(`House ${houseNo}: ${count} requests`);
      });
    doc.moveDown();

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
