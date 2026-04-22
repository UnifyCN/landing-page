import type { APIRoute } from "astro";
import { z } from "zod";
import { Resend } from "resend";
import { env } from "cloudflare:workers";

const schema = z.object({
  orgName: z.string().min(1, "Organization name is required").max(200),
  contactName: z.string().min(1, "Contact name is required").max(100),
  email: z.string().email("Invalid email address"),
  orgType: z.string().min(1, "Organization type is required"),
  city: z.string().min(1, "City / region is required").max(100),
  message: z.string().min(10, "Please tell us a bit more (at least 10 characters)").max(2000),
  turnstileToken: z.string().min(1, "Verification required"),
});

export const POST: APIRoute = async ({ request }) => {
  try {
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

    const { orgName, contactName, email, orgType, city, message, turnstileToken } = parsed.data;

    // Verify Turnstile token
    const turnstileSecret = (env as any).TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      try {
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
      } catch (err) {
        console.error("[partner-inquiry] Turnstile error:", err);
        return new Response(JSON.stringify({ success: false, error: "Verification failed. Please try again." }), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Send email via Resend
    const resendKey = (env as any).RESEND_API_KEY;
    const toEmail = (env as any).CONTACT_TO_EMAIL ?? "contact@unifysocial.ca";

    if (resendKey) {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from: "Unify Partner Inquiries <noreply@unifysocial.ca>",
        to: toEmail,
        replyTo: email,
        subject: `New partner inquiry from ${orgName}`,
        text: `Organization: ${orgName}\nContact: ${contactName}\nEmail: ${email}\nType: ${orgType}\nCity: ${city}\n\nHow can we collaborate:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #171616;">New partner inquiry</h2>
            <p><strong>Organization:</strong> ${orgName}</p>
            <p><strong>Contact:</strong> ${contactName}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Type:</strong> ${orgType}</p>
            <p><strong>City / Region:</strong> ${city}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 1.5rem 0;" />
            <p><strong>How can we collaborate:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      });
      if (error) {
        console.error("[partner-inquiry] Resend error:", error);
        return new Response(JSON.stringify({ success: false, error: "Failed to send inquiry. Please try again." }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[partner-inquiry] Unhandled error:", err);
    return new Response(JSON.stringify({ success: false, error: "Failed to send inquiry. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
