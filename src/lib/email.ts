import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  to: string;
  portfolioSlug?: string;
}) {
  const { name, email, subject, message, to, portfolioSlug } = params;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const safePortfolioSlug = escapeHtml(portfolioSlug || "");

  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
    to: to || process.env.EMAIL_TO,
    replyTo: email,
    subject: `Portfolio: ${subject.trim()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#6C63FF">New Contact Form Submission</h2>
        <hr style="border:1px solid #eee">
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        ${safePortfolioSlug ? `<p><strong>Portfolio:</strong> ${safePortfolioSlug}</p>` : ""}
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <h3>Message:</h3>
        <p style="background:#f5f5f5;padding:16px;border-radius:8px">${safeMessage}</p>
      </div>
    `,
  });
}
