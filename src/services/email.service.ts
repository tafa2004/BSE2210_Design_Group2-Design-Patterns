import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"PulseHub" <noreply@pulsehub.com>',
      to: email,
      subject: 'Welcome to PulseHub!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #667eea;">Welcome to PulseHub, ${name}!</h1>
          <p>Thank you for joining our event management community.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse upcoming events</li>
            <li>RSVP to events</li>
            <li>Create your own events (if you are an organizer)</li>
          </ul>
          <p>Happy event planning!</p>
          <p style="color: #999; font-size: 12px;">This is a test email from Ethereal</p>
        </div>
      `
    });

    console.log('Email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
    return info;
  } catch (error) {
    console.error('Email error:', error);
  }
};