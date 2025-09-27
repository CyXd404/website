import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'Method not allowed. Only POST requests are accepted.' 
      }),
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body || '{}');
    const { name, email, subject, message, hp } = body;

    // Honeypot check - if filled, pretend success but don't send
    if (hp) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Message sent successfully!' }),
      };
    }

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields. Please fill in all fields.' 
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid email format.' 
        }),
      };
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Email service is not configured. Please try again later.' 
        }),
      };
    }

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 10px;">Contact Information:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>This message was sent from your portfolio contact form.</p>
            <p>Sent at: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
            <p>User Agent: ${event.headers['user-agent'] || 'Unknown'}</p>
          </div>
        </div>
      </div>
    `;

    const emailText = `
New Contact Form Message

Contact Information:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio contact form.
Sent at: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}
User Agent: ${event.headers['user-agent'] || 'Unknown'}
    `;

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: process.env.CONTACT_EMAIL_FROM || 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL_TO || 'shawavatritya@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: emailHtml,
      text: emailText,
    });

    // Check if email was sent successfully
    if (emailResult.error) {
      console.error('Resend API error:', emailResult.error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Failed to send email. Please try again later.' 
        }),
      };
    }

    console.log('Email sent successfully:', emailResult.data?.id);

    // Return success response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully! I will get back to you soon.',
        emailId: emailResult.data?.id 
      }),
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Invalid request format.' 
        }),
      };
    }

    // Handle other errors
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.' 
      }),
    };
  }
};