import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  private generateVerificationCode(): string {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  }

  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string }) {
    const { to } = body;
    const code = this.generateVerificationCode();
    try {
      await this.mailService.sendEmail({
        to,
        code,
      });

      return { message: 'Email sent successfully!' };
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to send email', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
