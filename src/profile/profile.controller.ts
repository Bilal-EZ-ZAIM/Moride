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
  Delete,
  Req,
  Get,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { AuthGuardMoride } from '../guard/auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/profileUpdate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('profile')
@UseGuards(AuthGuardMoride)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly CloudinaryService: CloudinaryService,
  ) {}

  @Get('getProfiles')
  async getProfiles() {
    return await this.profileService.updateAllUsersWithProfileIds();
  }

  @Get('get/me')
  async getProfile(@Req() req: any) {
    return this.profileService.getProfile(req.user._id);
  }

  @Post('create')
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
  async updateProfile(
    @Body() updateProfileData: UpdateProfileDto,
    @Request() req: any,
  ) {
    console.log(updateProfileData)
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
      storage: memoryStorage(),
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
  async uploadImage(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file buffer available for upload.');
    }

    const url = await this.CloudinaryService.uploadFile(file);

    const data = {
      url: url.url,
      key: url.public_id,
    };
    return this.profileService.uploadeImageProfile(req.user._id, data);
  }

  @Post('uploadBannerImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
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
  async uploadPannerProfile(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File upload failed.');
    }

    const url = await this.CloudinaryService.uploadFile(file);
    console.log(url);

    const data = {
      url: url.url,
      key: url.public_id,
    };

    return this.profileService.uploadeImageBannerProfile(req.user._id, data);
  }

  @Delete('deleted')
  async deleted(@Body() body: any) {
    return this.CloudinaryService.deleteFile(body.id);
  }
}
