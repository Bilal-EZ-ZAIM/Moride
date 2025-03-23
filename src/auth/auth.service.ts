import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { CreateDto } from './dto/create.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { CodeDto } from './dto/code.dto';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDto } from './dto/updatePassword';
import { User } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private mail: MailService,
    private readonly configService: ConfigService,
  ) {}

  async updateIdProfile(id: string, idProfile: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      id,
      { profileId: idProfile },
      { new: true },
    );
  }

  generateToken(payload: any, expiresIn: string = '90d'): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn,
    });
  }



  async getAll() {
    const users = await this.userModel.findOne({
      isOnline: true,
    });
    if (!users) {
      throw new HttpException('User not fond', HttpStatus.NOT_FOUND);
    }

    return users;
  }

  async getUser(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException(
        {
          message:
            "Cet Utlisateur n'existe pas dans notre système. Veuillez vérifier et réessayer.",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async create(data: CreateDto) {
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

    const payload = { id: user._id };
    const token = await this.generateToken(payload);

    return token;
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
    const token = await this.generateToken(payload);

    return {
      user,
      token,
    };
  }

  async loginByGoogle(data: any) {

    const utilisateurExistant = await this.userModel.findOne({
      email: data.email,
    });

    if (utilisateurExistant) {
      const payload = { id: utilisateurExistant._id };
      const token = await this.generateToken(payload);

      return {
        message: 'Connexion réussie',
        utilisateur: utilisateurExistant,
        token,
      };
    }

    const nouvelUtilisateur = await this.userModel.create({
      username: data.username,
      email: data.email,
    });

    const payload = { id: nouvelUtilisateur._id };
    const token = await this.generateToken(payload);

    return {
      message: 'Inscription réussie et connexion effectuée',
      utilisateur: nouvelUtilisateur,
      token,
    };
  }

  private generateVerificationCode(): string {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  }

  async sendCodeByEmail(email: string) {
    const user = await this.userModel.findOne({ email: email });

    if (!user) {
      throw new HttpException(
        {
          message:
            "Cet email n'existe pas dans notre système. Veuillez vérifier et réessayer.",
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const code = this.generateVerificationCode();

    await this.mail.sendEmail({ to: email, code });

    const payload = { code, id: user._id };
    const token = await this.generateToken(payload, '10m');

    return {
      message: 'Un email de vérification a été envoyé avec succès.',
      token: token,
    };
  }

  async updatePassword(user: any, data: UpdatePasswordDto) {

    if (!user) {
      throw new HttpException('Email not correct', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await bcryptjs.compare(data.password, user.password);

    if (!checkPassword)
      throw new HttpException(
        'mot de passe incorrect. Veuillez vérifier vos informations.',
        HttpStatus.NOT_FOUND,
      );

    const salt = 10;
    const hashPassword = await bcryptjs.hashSync(data.newpassword, salt);
    user.password = hashPassword;
    await user.save();

    const payload = { id: user._id };
    const token = await this.generateToken(payload);

    return token;
  }

  async restPassword(code: string, user: any, storedCode: CodeDto) {
    if (!user) {
      throw new HttpException('Email not correct', HttpStatus.NOT_FOUND);
    }

    if (code !== storedCode.code) {
      throw new HttpException(
        'Invalid verification code',
        HttpStatus.BAD_REQUEST,
      );
    }
    const salt = 10;
    const hashPassword = await bcryptjs.hash(storedCode.newPassword, salt);
    user.password = hashPassword;

    await user.save();

    const payload = { id: user._id };
    const token = await this.generateToken(payload);

    return {
      message: 'Password reset successfully',
      token: token,
    };
  }

  async updateUser(id: string, updateData: Partial<User>) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true },
      );

      if (!updatedUser) {
        return null;
      }

      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }
}
