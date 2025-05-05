import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendApprovalEmail = async (event) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.organizarEmail,
        subject: 'Event Approved - ' + event.eventName,
        html: `
            <h1>Your Event Has Been Approved!</h1>
            <p>Dear ${event.organizarName},</p>
            <p>We are pleased to inform you that your event "${event.eventName}" has been approved.</p>
            <p>Event Details:</p>
            <ul>
                <li>Date: ${event.date}</li>
                <li>Time: ${event.time}</li>
                <li>Venue: ${event.venue}</li>
            </ul>
            <p>Thank you for using our platform!</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Approval email sent successfully');
    } catch (error) {
        console.error('Error sending approval email:', error);
    }
};

export const sendRejectionEmail = async (event) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.organizarEmail,
        subject: 'Event Rejected - ' + event.eventName,
        html: `
            <h1>Event Status Update</h1>
            <p>Dear ${event.organizarName},</p>
            <p>We regret to inform you that your event "${event.eventName}" has been rejected.</p>
            <p>Event Details:</p>
            <ul>
                <li>Date: ${event.date}</li>
                <li>Time: ${event.time}</li>
                <li>Venue: ${event.venue}</li>
            </ul>
            <p>If you have any questions, please contact us.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Rejection email sent successfully');
    } catch (error) {
        console.error('Error sending rejection email:', error);
    }
};

export const sendRequestNotificationEmail = async (event, request) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.organizarEmail,
        subject: 'New Event Request - ' + event.eventName,
        html: `
            <h1>New Event Request</h1>
            <p>Dear ${event.organizarName},</p>
            <p>You have received a new request to join your event "${event.eventName}".</p>
            <p>Request Details:</p>
            <ul>
                <li>Requester Name: ${request.requesterName}</li>
                <li>Requester Email: ${request.requesterEmail}</li>
                <li>Requester Phone: ${request.requesterPhone}</li>
                <li>Message: ${request.message}</li>
            </ul>
            <p>Please log in to your account to approve or reject this request.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Request notification email sent successfully');
    } catch (error) {
        console.error('Error sending request notification email:', error);
    }
};

export const sendRequestStatusEmail = async (event, request) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: request.requesterEmail,
        subject: `Event Request ${request.status} - ${event.eventName}`,
        html: `
            <h1>Event Request Update</h1>
            <p>Dear ${request.requesterName},</p>
            <p>Your request to join the event "${event.eventName}" has been ${request.status.toLowerCase()}.</p>
            <p>Event Details:</p>
            <ul>
                <li>Date: ${event.date}</li>
                <li>Time: ${event.time}</li>
                <li>Venue: ${event.venue}</li>
            </ul>
            ${request.status === 'Approved' ? 
                '<p>We look forward to seeing you at the event!</p>' : 
                '<p>Thank you for your interest in our event.</p>'
            }
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Request status email sent successfully');
    } catch (error) {
        console.error('Error sending request status email:', error);
    }
}; 