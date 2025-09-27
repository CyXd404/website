import { Resend } from 'resend';

export async function handler(event) {
  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'no-reply@resend.dev', // ganti dengan email terverifikasi di Resend
      to: 'shawavatritya@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      text: `
Nama: ${name}
Email: ${email}
Subjek: ${subject}

Pesan:
${message}

Dikirim pada: ${new Date().toLocaleString('id-ID')}
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error }),
    };
  }
}
