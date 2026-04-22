import type { APIRoute } from "astro";
import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  turnstileToken: z.string().min(1, "Verification required"),
});

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return new Response(JSON.stringify({ success: false, fieldErrors }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { name, email, message, turnstileToken } = parsed.data;

  // Verify Turnstile token
  const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: turnstileToken }),
    });
    const verifyData = await verifyRes.json() as { success: boolean };
    if (!verifyData.success) {
      return new Response(JSON.stringify({ success: false, error: "Verification failed. Please try again." }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // Send email via Resend
  const resendKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL || "contact@unifysocial.ca";

  if (resendKey) {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from: "Unify Contact <noreply@unifysocial.ca>",
      to: toEmail,
      replyTo: email,
      subject: `New contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #171616;">New contact message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 1.5rem 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });
    if (error) {
      return new Response(JSON.stringify({ success: false, error: "Failed to send message. Please try again." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
