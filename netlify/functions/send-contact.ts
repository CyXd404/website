// netlify/functions/send-contact.ts
import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = { 'Content-Type': 'application/json' };

  try {
    const payload = JSON.parse(event.body || '{}');

    const { name, email, subject, message, meta, hp } = payload || {};

    // Honeypot: jika terisi, anggap sukses (blokir bot)
    if (hp) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (!name || !email || !subject || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Missing required fields' }) };
    }

    const text = [
      `Nama: ${name}`,
      `Email: ${email}`,
      `Subjek: ${subject}`,
      ``,
      `Pesan:`,
      message,
      ``,
      `---`,
      `Meta: ${JSON.stringify(meta || {}, null, 2)}`,
      `Dikirim pada: ${new Date().toLocaleString('id-ID')}`,
    ].join('\n');

    const result = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'shawavatritya@gmail.com',
      reply_to: email,
      subject: `Portfolio Contact: ${subject}`,
      text,
    });

    if ((result as any)?.error) {
      throw new Error((result as any).error?.message || 'Resend error');
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: err?.message || 'Failed to send' }),
    };
  }
};