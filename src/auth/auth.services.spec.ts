import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import * as bcryptjs from 'bcryptjs';
import { User } from './schema/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let userModel: any;
  let jwtService: any;
  let mailService: any;

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
      signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
    };

    mailService = {
      sendEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('jwt-secret') },
        },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should create a new user and return a token', async () => {
    userModel.findOne.mockResolvedValue(null);
    userModel.create.mockResolvedValue({ _id: 'user-id' });

    const mockData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    jest.spyOn(bcryptjs, 'hashSync').mockReturnValue('hashed-password');

    const token = await authService.create(mockData);
    expect(token).toBe('fake-jwt-token');
    expect(userModel.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashed-password',
      confirmPassword: 'password123',
    });
  });

  it('should throw an error if email already exists', async () => {
    userModel.findOne.mockResolvedValue({ email: 'test@example.com' });

    const mockData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      confirmPassword: 'password123',
    };

    await expect(authService.create(mockData)).rejects.toThrow(
      'Un utilisateur avec cet email existe déjà. Veuillez en choisir un autre.',
    );
  });

  it('should return a token if login is successful', async () => {
    const user = {
      _id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password',
    };

    userModel.findOne.mockResolvedValue(user);
    jest
      .spyOn(bcryptjs, 'compare')
      .mockResolvedValue(Promise.resolve(true) as never);

    const mockLoginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await authService.login(mockLoginData);

    expect(result).toHaveProperty('user', user);
    expect(result).toHaveProperty('token', 'fake-jwt-token');
  });

  it('should throw an error if login email does not exist', async () => {
    userModel.findOne.mockResolvedValue(null);

    const mockLoginData = {
      email: 'notfound@example.com',
      password: 'password123',
    };

    await expect(authService.login(mockLoginData)).rejects.toThrow(
      'Email ou mot de passe incorrect. Veuillez vérifier vos informations.',
    );
  });

  it('should throw an error if login password is incorrect', async () => {
    const user = {
      _id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password',
    };

    userModel.findOne.mockResolvedValue(user);
    jest
      .spyOn(bcryptjs, 'compare')
      .mockResolvedValue(Promise.resolve(false) as never);

    const mockLoginData = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    await expect(authService.login(mockLoginData)).rejects.toThrow(
      'Email ou mot de passe incorrect. Veuillez vérifier vos informations.',
    );
  });

  it('should find a user by ID', async () => {
    const user = { _id: 'user-id', email: 'test@example.com' };
    userModel.findById.mockResolvedValue(user);

    const result = await authService.getUser('user-id');
    expect(result).toBe(user);
  });

  it('should throw an error if user is not found', async () => {
    userModel.findById.mockResolvedValue(null);

    await expect(authService.getUser('nonexistent-id')).rejects.toThrow(
      "Cet Utlisateur n'existe pas dans notre système. Veuillez vérifier et réessayer.",
    );
  });

  it('should send a verification code by email', async () => {
    const user = { _id: 'user-id', email: 'test@example.com' };
    userModel.findOne.mockResolvedValue(user);
    mailService.sendEmail.mockResolvedValue(true);
    jest
      .spyOn(authService as any, 'generateVerificationCode')
      .mockReturnValue('ABC123');

    const result = await authService.sendCodeByEmail('test@example.com');

    expect(result.message).toBe(
      'Un email de vérification a été envoyé avec succès.',
    );
    expect(result.token).toBe('fake-jwt-token');
  });

  it('should throw an error if email is not found when sending verification code', async () => {
    userModel.findOne.mockResolvedValue(null);

    await expect(
      authService.sendCodeByEmail('notfound@example.com'),
    ).rejects.toThrow(
      "Cet email n'existe pas dans notre système. Veuillez vérifier et réessayer.",
    );
  });

  it('should find a user by ID', async () => {
    const user = { _id: 'user-id', email: 'test@example.com' };
    userModel.findById.mockResolvedValue(user);

    const result = await authService.getUser('user-id');

    expect(result).toBe(user);
    expect(userModel.findById).toHaveBeenCalledWith('user-id');
  });

  it('should throw an error if user is not found', async () => {
    userModel.findById.mockResolvedValue(null);

    await expect(authService.getUser('nonexistent-id')).rejects.toThrow(
      "Cet Utlisateur n'existe pas dans notre système. Veuillez vérifier et réessayer.",
    );
  });

  it('should update user password successfully', async () => {
    const mockUser = {
      _id: 'user-id',
      password: await bcryptjs.hash('oldpassword', 10),
      save: jest.fn(),
    };

    const updatePasswordDto = {
      password: 'oldpassword',
      newpassword: 'newpassword123',
    };

    jest
      .spyOn(bcryptjs, 'compare')
      .mockResolvedValue(Promise.resolve(true) as never);
    jest.spyOn(bcryptjs, 'hashSync').mockReturnValue('hashed-newpassword');

    const token = await authService.updatePassword(mockUser, updatePasswordDto);

    expect(mockUser.password).toBe('hashed-newpassword');
    expect(mockUser.save).toHaveBeenCalled();
    expect(token).toBe('fake-jwt-token');
  });

  it('should throw an error if old password is incorrect', async () => {
    const mockUser = {
      _id: 'user-id',
      password: await bcryptjs.hash('oldpassword', 10),
      save: jest.fn(),
    };

    const updatePasswordDto = {
      password: 'wrongpassword',
      newpassword: 'newpassword123',
    };

    jest
      .spyOn(bcryptjs, 'compare')
      .mockResolvedValue(Promise.resolve(false) as never);

    await expect(
      authService.updatePassword(mockUser, updatePasswordDto),
    ).rejects.toThrow(
      'mot de passe incorrect. Veuillez vérifier vos informations.',
    );
  });
});
