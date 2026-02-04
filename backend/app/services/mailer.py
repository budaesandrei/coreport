from __future__ import annotations

import smtplib
from email.message import EmailMessage

from app.core.config import settings


def send_email(*, to_email: str, subject: str, text_body: str, html_body: str | None = None) -> dict:
    """Send an email via configured SMTP (dev uses MailHog).

    Returns a small payload useful for debugging/tests.
    """

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = settings.SMTP_FROM
    msg["To"] = to_email

    msg.set_content(text_body)
    if html_body:
        msg.add_alternative(html_body, subtype="html")

    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as smtp:
        smtp.send_message(msg)

    return {
        "to": to_email,
        "from": settings.SMTP_FROM,
        "subject": subject,
        "text_body": text_body,
        "html_body": html_body,
        "smtp_host": settings.SMTP_HOST,
        "smtp_port": settings.SMTP_PORT,
    }
