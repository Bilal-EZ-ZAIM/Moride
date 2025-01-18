import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/profileUpdate.dto';

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
}
