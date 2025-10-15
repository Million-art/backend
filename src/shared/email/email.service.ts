import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not found in environment variables');
    }
    
    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('FROM_EMAIL') || 'Maraki <noreply@techsphareet.com>';
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: options.from || this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        this.logger.error('Failed to send email:', error);
        return false;
      }

      this.logger.log(`Email sent successfully to ${options.to}: ${data?.id}`);
      return true;
    } catch (error) {
      this.logger.error('Email service error:', error);
      return false;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string, temporaryPassword?: string): Promise<boolean> {
    const subject = 'Welcome to Maraki Educational Management System';
    const html = this.generateWelcomeEmailHtml(userName, temporaryPassword);

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendUserCreatedEmail(userEmail: string, userName: string, adminName: string, temporaryPassword?: string): Promise<boolean> {
    const subject = 'Your Maraki Account Has Been Created';
    const html = this.generateUserCreatedEmailHtml(userName, adminName, temporaryPassword);

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  async sendInviteEmail({
    to,
    inviteLink,
    userName,
    expiryHours = 24,
  }: {
    to: string;
    inviteLink: string;
    userName?: string;
    expiryHours?: number;
  }): Promise<boolean> {
    const subject = 'Welcome to Maraki - Set Your Password';
    const html = this.generateInviteEmailHtml(userName || to, inviteLink, expiryHours);

    return this.sendEmail({
      to,
      subject,
      html,
    });
  }

  async sendPasswordResetEmail({
    to,
    resetLink,
    userName,
    expiryHours = 24,
  }: {
    to: string;
    resetLink: string;
    userName?: string;
    expiryHours?: number;
  }): Promise<boolean> {
    const subject = 'Reset Your Maraki Password';
    const html = this.generatePasswordResetEmailHtml(userName || to, resetLink, expiryHours);

    return this.sendEmail({
      to,
      subject,
      html,
    });
  }

  private generateWelcomeEmailHtml(userName: string, temporaryPassword?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Maraki</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .credentials { background: #e0e7ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 Welcome to Maraki!</h1>
         </div>
        
        <div class="content">
          <h2>Hello ${userName}!</h2>
          
          <p>Welcome to the Maraki Dashboard We're excited to have you on board.</p>
          
          ${temporaryPassword ? `
          <div class="credentials">
            <h3>🔐 Your Login Credentials</h3>
            <p><strong>Email:</strong> Your registered email address</p>
            <p><strong>Temporary Password:</strong> <code>${temporaryPassword}</code></p>
            <p><em>⚠️ This temporary password expires in 24 hours. Please change it immediately after login.</em></p>
          </div>
          ` : ''}
          
          <p>You can now access the system and start managing educational content, quizzes, and materials.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Login to Maraki</a>
           
          
          <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Maraki AI. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  private generateUserCreatedEmailHtml(userName: string, adminName: string, temporaryPassword?: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Created - Maraki</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .credentials { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Account Created!</h1>
         </div>
        
        <div class="content">
          <h2>Hello ${userName}!</h2>
          
          <p>Your account has been successfully created by <strong>${adminName}</strong> in the Maraki Educational Management System.</p>
          
          ${temporaryPassword ? `
          <div class="credentials">
            <h3>🔐 Your Login Credentials</h3>
            <p><strong>Email:</strong> Your registered email address</p>
            <p><strong>Temporary Password:</strong> <code>${temporaryPassword}</code></p>
            <p><em>⚠️ This temporary password expires in 24 hours. Please change it immediately after login.</em></p>
          </div>
          ` : ''}
          
          <p>You can now access the system and start using all the available features.</p>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Access Your Account</a>
          
          <h3>Next Steps:</h3>
          <ol>
            <li>Login with your credentials</li>
            <li>Change your temporary password</li>
            <li>Complete your profile setup</li>
            <li>Start exploring the system</li>
          </ol>
          
          <p>If you have any questions or need assistance, please contact your administrator or our support team.</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Maraki Educational Management System. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  private generateInviteEmailHtml(userName: string, inviteLink: string, expiryHours: number): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Maraki</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ff9500; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎓 Welcome to Maraki!</h1>
         </div>
        
        <div class="content">
          <h2>Hello ${userName}!</h2>
          
          <p>Your account has been created successfully. To get started, please set your password by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" class="button">Set Your Password</a>
          </div>
          
          <div class="warning">
            <h3>⏰ Important Security Notice</h3>
            <ul>
              <li>This invitation link expires in <strong>${expiryHours} hours</strong></li>
              <li>You must set your password before the link expires</li>
              <li>If you didn't expect this invitation, please ignore this email</li>
            </ul>
          </div>
       
          
          <p>If you have any questions or need assistance, please contact our support team.</p>
        </div>
        
        <div class="footer">
          <p>© 2025 Maraki AI. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  private generatePasswordResetEmailHtml(userName: string, resetLink: string, expiryHours: number): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - Maraki</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #dc2626; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); transition: all 0.2s ease-in-out; }
          .button:hover { background: #b91c1c; transform: translateY(-1px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
          .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔐 Password Reset</h1>
          <p>Maraki Educational Management System</p>
        </div>
        
        <div class="content">
          <h2>Hello ${userName}!</h2>
          
          <p>You requested to reset your password for your Maraki account.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" class="button">🔐 Reset My Password</a>
          </div>
          
          <div class="warning">
            <h3>⏰ Important Security Notice</h3>
            <ul>
              <li>This link expires in <strong>${expiryHours} hours</strong></li>
              <li>You must reset your password before the link expires</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
          </div>
          
          <p>If you have any questions or need assistance, please contact our support team.</p>
        </div>
        
        <div class="footer">
          <p>© 2024 Maraki Educational Management System. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }
}
