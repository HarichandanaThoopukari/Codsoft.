const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"JobBoard" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};

// Email templates
exports.sendApplicationConfirmation = async (candidate, job) => {
  await sendEmail({
    to: candidate.email,
    subject: `Application Submitted - ${job.title} at ${job.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">JobBoard</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2>Application Submitted! 🎉</h2>
          <p>Hi <strong>${candidate.name}</strong>,</p>
          <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> has been successfully submitted.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p><strong>Job:</strong> ${job.title}</p>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
          </div>
          <p>The employer will review your application and get back to you. Good luck!</p>
        </div>
        <div style="background: #1e40af; padding: 15px; text-align: center; color: #93c5fd; font-size: 12px;">
          <p>© 2024 JobBoard. All rights reserved.</p>
        </div>
      </div>
    `
  });
};

exports.sendEmployerNotification = async (employer, candidate, job) => {
  await sendEmail({
    to: employer.email,
    subject: `New Application Received - ${job.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">JobBoard</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2>New Application Received!</h2>
          <p>Hi <strong>${employer.name}</strong>,</p>
          <p>You have received a new application for <strong>${job.title}</strong>.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <p><strong>Candidate:</strong> ${candidate.name}</p>
            <p><strong>Email:</strong> ${candidate.email}</p>
            <p><strong>Job Position:</strong> ${job.title}</p>
          </div>
          <p>Log in to your employer dashboard to review the application.</p>
        </div>
      </div>
    `
  });
};

exports.sendStatusUpdate = async (candidate, job, status) => {
  const statusMessages = {
    Reviewing: 'is being reviewed by the employer',
    Shortlisted: 'has been shortlisted! You may be contacted for an interview',
    Interview: 'has been selected for an interview. The employer will contact you shortly',
    Offered: 'has resulted in a job offer! Congratulations! 🎉',
    Rejected: 'has not been selected at this time. Keep applying!'
  };

  await sendEmail({
    to: candidate.email,
    subject: `Application Update - ${job.title} at ${job.company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">JobBoard</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2>Application Status Update</h2>
          <p>Hi <strong>${candidate.name}</strong>,</p>
          <p>Your application for <strong>${job.title}</strong> at <strong>${job.company}</strong> ${statusMessages[status] || `status updated to: ${status}`}.</p>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p><strong>New Status:</strong> <span style="color: #2563eb;">${status}</span></p>
          </div>
        </div>
      </div>
    `
  });
};
