from app.core.config import get_settings
from string import Template
import os
import boto3

settings = get_settings()

ses_client = boto3.client("ses", region_name=settings.AWS_SES_REGION)

base_dir = os.path.dirname(os.path.abspath(__file__))

complete_registration_template_path = os.path.join(base_dir, "complete_registration_template.html")
accept_invitation_template_path = os.path.join(base_dir, "accept_invitation_template.html")

def send_registration_email(email: str, first_name: str, project_name: str, token: str):
    subject = "Activate your Coreport Project"
    link = f"{settings.APP_DOMAIN_URL}/complete-registration?token={token}"

    with open(complete_registration_template_path, "r") as file:
        template = Template(file.read())

    body_html = template.substitute(
        first_name=first_name, project_name=project_name, link=link
    )

    try:
        ses_client.send_email(
            Source=settings.EMAIL,
            Destination={"ToAddresses": [email]},
            Message={
                "Subject": {"Data": subject},
                "Body": {"Html": {"Data": body_html}},
            },
        )
        print(f"✅ Invitation email sent to {email}")
    except Exception as e:
        print(f"❌ Failed to send invitation email to {email}: {e}")


def send_invite_email(email: str, first_name: str, project_name: str, token: str):
    subject = f"You have been invited to join the {project_name} project"
    link = f"{settings.APP_DOMAIN_URL}/accept-invitation?token={token}"

    with open(accept_invitation_template_path, "r") as file:
        template = Template(file.read())

    body_html = template.substitute(
        first_name=first_name, project_name=project_name, link=link
    )

    try:
        ses_client.send_email(
            Source=settings.EMAIL,
            Destination={"ToAddresses": [email]},
            Message={
                "Subject": {"Data": subject},
                "Body": {"Html": {"Data": body_html}},
            },
        )
        print(f"✅ Invitation email sent to {email}")
    except Exception as e:
        print(f"❌ Failed to send invitation email to {email}: {e}")
