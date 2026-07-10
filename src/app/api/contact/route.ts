import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, brand, email, message } = body;

    if (!name || !brand || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log(`[CONTACT FORM] Message received from ${name} (${brand} - ${email}): ${message}`);

    const resendKey = process.env.RESEND_API_KEY;
    const contactTo = process.env.CONTACT_TO || "hello@sunai.studio";

    if (resendKey) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Sunai Studio Form <onboarding@resend.dev>",
            to: contactTo,
            subject: `New Project Inquiry: ${brand} from ${name}`,
            html: `
              <h3>New inquiry from Sunai Studio Contact Form</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Brand:</strong> ${brand}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            `,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error("Resend API returned error:", errText);
        }
      } catch (err) {
        console.error("Failed to send email via Resend:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
