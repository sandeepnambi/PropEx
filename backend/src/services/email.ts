// src/services/email.ts

import nodemailer from 'nodemailer';

// Nodemailer Transporter Configuration
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Auto-fallback to Ethereal if credentials are not provided or if it's development
if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
  nodemailer.createTestAccount().then((account) => {
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  });
} else {
  // Verify connection configuration for real SMTP
  transporter.verify((error, success) => {
    if (error) {
      console.error('Nodemailer Connection Error:', error);
    } else {
      console.log('Email server is ready');
    }
  });
}

const SENDER_EMAIL = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@realestate-app.com';

/**
 * Low-level function to send a transactional email.
 * @param toEmail The recipient's email address.
 * @param subject The email subject line.
 * @param text The plain text content of the email.
 * @param html The HTML content of the email.
 */
export const sendEmail = async (toEmail: string, subject: string, text: string, html: string): Promise<void> => {
  const mailOptions = {
    from: SENDER_EMAIL,
    to: toEmail,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    
    // If using Ethereal, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Preview URL: ${previewUrl}`);
    }
  } catch (error) {
    console.error('Nodemailer Error:', error);
    throw new Error('Failed to send email notification.');
  }
};

/**
 * High-level function to send a notification about a new buyer lead.
 */
export const sendNewLeadNotification = async (
    agentEmail: string, 
    listingTitle: string, 
    leadDetails: { name: string, email: string, phone?: string, message: string }
): Promise<void> => {
    const subject = `NEW LEAD: Inquiry for listing: ${listingTitle}`;
    
    const text = `
        You have a new lead for your listing: ${listingTitle}.
        
        Lead Details:
        Name: ${leadDetails.name}
        Email: ${leadDetails.email}
        Phone: ${leadDetails.phone || 'N/A'}
        Message: ${leadDetails.message}
        
        Action Required: Log into your dashboard to contact them immediately!
    `;

    const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007bff;">New Property Inquiry!</h2>
            <p>You have a new lead for your listing: <strong>${listingTitle}</strong>.</p>
            <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; background-color: #f9f9f9;">
                <h4 style="margin-top: 0; border-bottom: 2px solid #ccc; padding-bottom: 5px;">Lead Details:</h4>
                <ul>
                    <li><strong>Name:</strong> ${leadDetails.name}</li>
                    <li><strong>Email:</strong> <a href="mailto:${leadDetails.email}">${leadDetails.email}</a></li>
                    <li><strong>Phone:</strong> ${leadDetails.phone || 'N/A'}</li>
                    <li><strong>Message:</strong> ${leadDetails.message}</li>
                </ul>
            </div>
            <p><strong>Action Required:</strong> Log into your agent dashboard to manage this lead.</p>
        </div>
    `;

    await sendEmail(agentEmail, subject, text, html);
};