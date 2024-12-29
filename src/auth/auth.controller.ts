import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { log } from 'console';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { CreateDto } from './dto/create.dto';
import { ConfiremPasssword } from 'src/validation/confiremPassword.pipe';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/:id')
  findAll(@Req() req: any, @Param('id', ValidationPipe) id: number): any {
    return this.authService.getAll();
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

  @Post('/restPassword')
  async restPassword(@Body() body: any) {
    const user = await this.authService.restPassword(body);
    return {
      message: 'Update Password with Succes',
      token: user,
    };
  }
}
