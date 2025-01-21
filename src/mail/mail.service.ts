import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as fs from 'fs';
import * as path from 'path';
import { log } from 'console';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendEmail(mailData: {
    to: string;
    code: string;
  }): Promise<void> {
    console.log(mailData)
    const verificationCode = mailData.code;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Réinitialisation de votre mot de passe Moride</title>
        <style>
              body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #f4f4f4;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f4f4f4;
        }
        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            padding: 30px;
            text-align: center;
            border-radius: 0 0 30px 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header h2 {
            color: white;
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            letter-spacing: 2px;
        }
        .email-container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 0;
            max-width: 600px;
            border-radius: 15px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        .email-body {
            padding: 40px 30px;
        }
        h1 {
            color: #333333;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: bold;
            text-align: center;
        }
        p {
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
            margin: 0 0 15px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 16px;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
        }
        .verification-code {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border: 2px dashed #28a745;
            padding: 25px;
            margin: 30px 0;
            text-align: center;
            border-radius: 15px;
            position: relative;
        }
        .verification-code::before {
            content: '🔐';
            font-size: 24px;
            position: absolute;
            top: -15px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 0 10px;
        }
        .verification-code code {
            font-size: 32px;
            color: #28a745;
            font-weight: bold;
            letter-spacing: 4px;
            display: block;
            margin: 10px 0;
        }
        .expiration-warning {
            color: #dc3545;
            font-size: 14px;
            text-align: center;
            margin-top: 15px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .expiration-warning::before {
            content: '⏳';
            font-size: 18px;
        }
        .footer {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            padding: 30px;
            text-align: center;
            border-radius: 15px 15px 0 0;
        }
        .footer p {
            color: #ffffff;
            font-size: 14px;
            margin: 5px 0;
        }
        .footer a {
            color: #ffffff;
            text-decoration: underline;
            font-weight: bold;
        }
        .divider {
            border-top: 2px solid #e8e8e8;
            margin: 30px 0;
            position: relative;
        }
        .divider::before {
            content: '✦';
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 0 10px;
            color: #28a745;
        }
        .signature {
            margin-top: 30px;
            color: #666666;
            text-align: center;
            font-style: italic;
        }
        .security-note {
            background-color: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #666;
            border-radius: 0 8px 8px 0;
        }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="email-container">
                <div class="header">
                    <h2>MORIDE</h2>
                </div>

                <div class="email-body">
                    <h1>🔑 Réinitialisation de votre mot de passe</h1>

                    <p>Bonjour! 👋</p>

                    <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Moride. Voici comment procéder :</p>

                    <div class="button-container">
                        <a href="[RESET_PASSWORD_LINK]" class="button">Réinitialiser mon mot de passe</a>
                    </div>

                    <p>Ou utilisez ce code de vérification sécurisé :</p>

                    <div class="verification-code">
                        <code>${verificationCode}</code>
                        <p class="expiration-warning">Ce code expirera dans 10 minutes</p>
                    </div>

                    <div class="security-note">
                        <strong>🛡️ Note de sécurité :</strong><br>
                        Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet e-mail ou contacter immédiatement notre service client.
                    </div>

                    <div class="divider"></div>

                    <div class="signature">
                        <p>À votre service,<br><strong>L'équipe Moride</strong> 🚗</p>
                    </div>
                </div>

                <div class="footer">
                    <p>Cet e-mail a été envoyé par Moride</p>
                    <p>© 2024 Moride. Tous droits réservés.</p>
                    <p>Questions? Contactez-nous à <a href="mailto:support@moride.com">support@moride.com</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
      await this.mailerService.sendMail({
        to: mailData.to,
        from: 'bbilalzaimrajawi@gmail.com',
        subject: 'Réinitialisation de votre mot de passe',
        html: htmlContent,
      });
      console.log('Email sent successfully!');
    } catch (error) {
      console.error('Error while sending email:', error.message);
      throw new RequestTimeoutException('Failed to send email');
    }
  }
}
