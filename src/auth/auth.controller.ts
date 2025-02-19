import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CreateDto } from './dto/create.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { CodeDto } from './dto/code.dto';
import { UpdatePasswordDto } from './dto/updatePassword';
import { AuthGuardMoride } from 'src/guard/auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/user')
  findAll(@Req() req: any): any {
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
  @UseGuards(AuthGuardMoride)
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
  @UseGuards(AuthGuardMoride)
  async verifyCode(@Request() req: any, @Body() codeDto: CodeDto) {
    const reastPassword = this.authService.restPassword(
      req.code,
      req.user,
      codeDto,
    );

    return reastPassword;
  }

  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleLogins() {
    return 'hell';
  }
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: any, @Res() res: any) {
    const user = req.user;
    console.log(user.profile.displayName);
    console.log(user.profile.emails[0].value);
    const username = user.profile.displayName;
    const email = user.profile.emails[0].value;
    const loginByGoole = await this.authService.loginByGoogle({
      username,
      email,
    });

    if (loginByGoole) {
      return res.redirect(
        `http://localhost:5173/welcome/page?token=${loginByGoole.token}`,
      );
    }
  }

  @Get('/islogin')
  @UseGuards(AuthGuardMoride)
  async getUser(@Req() req: any) {
    return req.user;
  }
}
