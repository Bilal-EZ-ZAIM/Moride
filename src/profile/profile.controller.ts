import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Put,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/profileUpdate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async createProfile(
    @Body() profileData: CreateProfileDto,
    @Request() req: any,
  ) {
    const user = req.user;

    const profile = await this.profileService.createProfile(
      profileData,
      user._id,
    );

    return {
      message: 'Le profil a été créé avec succès',
      profile: profile,
    };
  }

  @Put('update')
  @UseGuards(AuthGuard)
  async updateProfile(
    @Body() updateProfileData: UpdateProfileDto,
    @Request() req: any,
  ) {
    const userId = req.user._id;

    const result = await this.profileService.updateProfile(
      updateProfileData,
      userId,
    );

    return result;
  }

  @Post('uploadProfileImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          const filename = `${prefix}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed.');
    }

    const fileUrl = `http://localhost:3000/images/${file.filename}`;
    return { message: 'File uploaded successfully', fileUrl };
  }

  @Post('uploadBannerImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          const filename = `${prefix}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  uploadPannerProfile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed.');
    }

    const fileUrl = `http://localhost:3000/images/${file.filename}`;
    return { message: 'File uploaded successfully', fileUrl };
  }
}
