const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  return transporter;
};

// Email templates
const templates = {
  leave_request: (data) => ({
    subject: 'New Leave Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Leave Request</h2>
        <p>Dear ${data.managerName},</p>
        <p>A new leave request has been submitted by <strong>${data.employeeName}</strong>.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Leave Details:</h3>
          <ul>
            <li><strong>Employee:</strong> ${data.employeeName}</li>
            <li><strong>Leave Type:</strong> ${data.leaveType}</li>
            <li><strong>Start Date:</strong> ${data.startDate}</li>
            <li><strong>End Date:</strong> ${data.endDate}</li>
            <li><strong>Total Days:</strong> ${data.totalDays}</li>
            <li><strong>Reason:</strong> ${data.reason}</li>
          </ul>
        </div>
        <p>Please review and approve/reject this request in the system.</p>
        <p>Best regards,<br>Leave Management System</p>
      </div>
    `
  }),

  leave_approval: (data) => ({
    subject: `Leave Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${data.status === 'approved' ? '#28a745' : '#dc3545'};">
          Leave Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </h2>
        <p>Dear ${data.employeeName},</p>
        <p>Your leave request has been <strong>${data.status}</strong> by ${data.approvedBy}.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Leave Details:</h3>
          <ul>
            <li><strong>Leave Type:</strong> ${data.leaveType}</li>
            <li><strong>Start Date:</strong> ${data.startDate}</li>
            <li><strong>End Date:</strong> ${data.endDate}</li>
            <li><strong>Status:</strong> ${data.status}</li>
            ${data.comments ? `<li><strong>Comments:</strong> ${data.comments}</li>` : ''}
          </ul>
        </div>
        <p>Best regards,<br>Leave Management System</p>
      </div>
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to Leave Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Leave Management System</h2>
        <p>Dear ${data.name},</p>
        <p>Your account has been created successfully. You can now access the leave management system.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Account Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Employee ID:</strong> ${data.employeeId}</li>
            <li><strong>Role:</strong> ${data.role}</li>
          </ul>
        </div>
        <p>Please log in to the system to start using the leave management features.</p>
        <p>Best regards,<br>Leave Management System</p>
      </div>
    `
  })
};

// Send email notification
const sendEmailNotification = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();
    
    if (!templates[template]) {
      throw new Error(`Email template '${template}' not found`);
    }

    const emailContent = templates[template](data);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

// Send welcome email to new user
const sendWelcomeEmail = async (user) => {
  try {
    await sendEmailNotification({
      to: user.email,
      subject: 'Welcome to Leave Management System',
      template: 'welcome',
      data: {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Welcome email error:', error);
    // Don't throw error as this shouldn't block user registration
  }
};

module.exports = {
  sendEmailNotification,
  sendWelcomeEmail
};
