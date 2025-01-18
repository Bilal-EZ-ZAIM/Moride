import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CreateDto } from './dto/create.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { CodeDto } from './dto/code.dto';
import { UpdatePasswordDto } from './dto/updatePassword';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/user/:id')
  findAll(@Req() req: any, @Param('id', ValidationPipe) id: number): any {
    return this.authService.getAll();
  }

  @Get('/res')
  async restPas() {
    return {
      message: this.authService.restPas(),
    };
  }

  @Post('/register')
  async createUser(@Body() body: CreateDto) {
    const user = await this.authService.create(body);
    return {
      user,
      message: 'Utilisateur créé avec succès. Bienvenue parmi nous !',
    };
  }

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);
    return {
      message: 'Connexion réussie, bienvenue !',
      token: user.token,
      user: user.user,
    };
  }

  @Put('/restPassword')
  @UseGuards(AuthGuard)
  async restPassword(@Req() req: any, @Body() body: UpdatePasswordDto) {
    console.log('hello');

    const user = await this.authService.updatePassword(req.user, body);
    return {
      message: 'Update Password with Succes',
      token: user,
    };
  }

  @Post('/send')
  async restPasswordsss(@Body() { email }: EmailDto) {
    console.log('hello');

    const token = await this.authService.sendCodeByEmail(email);

    return token;
  }
  @Post('verify/code')
  @UseGuards(AuthGuard)
  async verifyCode(@Request() req: any, @Body() codeDto: CodeDto) {
    const reastPassword = this.authService.restPassword(
      req.code,
      req.user,
      codeDto,
    );

    return reastPassword;
  }
}
