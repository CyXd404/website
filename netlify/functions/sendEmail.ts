import type { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No data provided" }),
      };
    }

    const { name, email, subject, message } = JSON.parse(event.body);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // Ganti jika perlu
      to: "shawavatritya@gmail.com",  // Email tujuanmu
      subject: subject || "Pesan Baru dari Form Kontak",
      html: `
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
