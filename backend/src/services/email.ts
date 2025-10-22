// src/services/email.ts

import sgMail from '@sendgrid/mail';

// Set SendGrid API Key from .env
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  // This will throw if you try to send an email without a key
  console.error("FATAL ERROR: SENDGRID_API_KEY is not defined.");
}

const SENDER_EMAIL = process.env.SENDER_EMAIL || 'noreply@realestate-app.com';

/**
 * Low-level function to send a transactional email.
 * @param toEmail The recipient's email address (the Agent).
 * @param subject The email subject line.
 * @param text The plain text content of the email.
 * @param html The HTML content of the email.
 */
export const sendEmail = async (toEmail: string, subject: string, text: string, html: string): Promise<void> => {
  if (!SENDGRID_API_KEY) {
    console.error(`Email attempt blocked: API key missing. Subject: ${subject}`);
    throw new Error('Email service is not configured.');
  }

  const msg = {
    to: toEmail,
    from: SENDER_EMAIL, // Your verified sender email
    subject,
    text,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Lead notification sent successfully to Agent: ${toEmail}`);
  } catch (error) {
    // Log detailed error from SendGrid's response body
    console.error('SendGrid Error:', (error as any).response?.body || error);
    throw new Error('Failed to send email notification to agent.');
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
    const subject = `🔥 NEW LEAD: Inquiry for listing: ${listingTitle}`;
    
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