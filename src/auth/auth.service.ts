import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { CreateDto } from './dto/create.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('User_MODEL')
    private userModel: Model<any>,
    private jwtService: JwtService,
  ) {}

  async getAll() {
    const users = await this.userModel.findOne({
      email: 'bilalzaim@gmail.com',
    });
    if (!users) {
      throw new HttpException('User not fond', HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async create(data: any) {
    const existeEmail = await this.userModel.findOne({ email: data.email });

    if (existeEmail)
      throw new HttpException(
        'Un utilisateur avec cet email existe déjà. Veuillez en choisir un autre.',
        HttpStatus.BAD_REQUEST,
      );

    const existeUsername = await this.userModel.findOne({
      username: data.username,
    });

    if (existeUsername)
      throw new HttpException(
        "Un utilisateur avec ce nom d'utilisateur existe déjà. Veuillez en choisir un autre.",
        HttpStatus.BAD_REQUEST,
      );

    const salt = 10;
    const hashPassword = await bcryptjs.hashSync(data.password, salt);
    data.password = hashPassword;

    const user = await this.userModel.create(data);

    return user;
  }

  async login(data: any) {
    const user = await this.userModel.findOne({ email: data.email });

    if (!user)
      throw new HttpException(
        'Email ou mot de passe incorrect. Veuillez vérifier vos informations.',
        HttpStatus.NOT_FOUND,
      );

    const checkPassword = await bcryptjs.compare(data.password, user.password);

    if (!checkPassword)
      throw new HttpException(
        'Email ou mot de passe incorrect. Veuillez vérifier vos informations.',
        HttpStatus.NOT_FOUND,
      );

    const payload = { id: user._id };
    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  }

  async restPassword(data: any) {
    const user = await this.userModel.findOne({ email: data.email });

    if (!user)
      throw new HttpException(
        'Email Or Password not Coorect',
        HttpStatus.NOT_FOUND,
      );

    const salt = 10;
    const hashPassword = await bcryptjs.hashSync(data.newpassword, salt);
    user.password = hashPassword;
    await user.save();

    const payload = { id: user._id };
    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
