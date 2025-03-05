import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/profile.dto';
import { Profile } from './schema/profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateProfileDto } from './dto/profileUpdate.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly profileModel: Model<Profile>,
    private readonly CloudinaryService: CloudinaryService,
    private readonly userService: AuthService,
  ) {}

  async updateAllUsersWithProfileIds() {
    const profiles = await this.profileModel.find();

    for (const profile of profiles) {
      await this.userService.updateIdProfile(
        profile.userId.toString(),
        profile._id.toString(),
      );
    }

    console.log(
      '✅ Tous les utilisateurs ont été mis à jour avec leur profileId avec succès !',
    );
  }

  async getProfile(id: string) {
    const profile = await this.profileModel.findOne({ userId: id });

    if (!profile) {
      throw new NotFoundException("Le profil de cet utilisateur n'existe pas.");
    }

    return profile;
  }

  async createProfile(
    profile: CreateProfileDto,
    userId: string,
  ): Promise<Profile> {
    try {
      const existingProfile = await this.profileModel.findOne({ userId });
      if (existingProfile) {
        throw new BadRequestException(
          'Le profil de cet utilisateur existe déjà.',
        );
      }

      const data = {
        ...profile,
        userId,
      };

      console.log('******************');
      console.log(data);
      console.log('******************');

      const newprofile: any = await this.profileModel.create(data);
      await this.userService.updateIdProfile(userId, newprofile?._id);
      return newprofile;
    } catch (error) {
      if (error && error.code === 11000) {
        console.log('Duplicate key value:', error.errorResponse.keyValue);

        const duplicateField = Object.keys(error.errorResponse.keyValue)[0];
        const duplicateValue = error.errorResponse.keyValue[duplicateField];

        throw new BadRequestException(
          `Le champ '${duplicateField}' avec la valeur '${duplicateValue}' est déjà utilisé.`,
        );
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Une erreur est survenue lors de la création du profil.',
      );
    }
  }

  async updateProfile(updateData: UpdateProfileDto, userId: string) {
    try {
      const existingProfile = await this.profileModel.findOne({ userId });

      if (!existingProfile) {
        throw new NotFoundException(
          "Le profil de cet utilisateur n'a pas été trouvé.",
        );
      }

      const updatedProfile = await this.profileModel
        .findByIdAndUpdate(existingProfile._id, updateData, { new: true })
        .exec();

      if (!updatedProfile) {
        throw new BadRequestException('La mise à jour du profil a échoué.');
      }

      return {
        message: 'Profil mis à jour avec succès.',
        data: updatedProfile,
      };
    } catch (error) {
      if (error && error.code === 11000) {
        console.log('Duplicate key error code:', error.code);

        const duplicateField = Object.keys(error.errorResponse.keyValue)[0];
        const duplicateValue = error.errorResponse.keyValue[duplicateField];

        throw new BadRequestException(
          `Le champ '${duplicateField}' avec la valeur '${duplicateValue}' est déjà utilisé.`,
        );
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Une erreur est survenue lors de la mise à jour du profil.',
      );
    }
  }

  async uploadeImageProfile(
    userId: string,
    imageProfile: { url: string; key: string },
  ) {
    console.log(imageProfile);

    try {
      const existingProfile = await this.profileModel.findOne({ userId });

      if (!existingProfile) {
        throw new NotFoundException(
          "Le profil de cet utilisateur n'a pas été trouvé.",
        );
      }

      if (existingProfile.imageProfile) {
        await this.CloudinaryService.deleteFile(
          existingProfile.imageProfile.key,
        );
      }
      const updatedProfile = await this.profileModel
        .findByIdAndUpdate(existingProfile._id, { imageProfile }, { new: true })
        .exec();

      if (!updatedProfile) {
        throw new BadRequestException('La mise à jour du profil a échoué.');
      }

      return {
        message: 'Profil mis à jour avec succès.',
        data: updatedProfile,
      };
    } catch (error) {
      if (error && error.code === 11000) {
        console.log('Duplicate key error code:', error.code);

        const duplicateField = Object.keys(error.errorResponse.keyValue)[0];
        const duplicateValue = error.errorResponse.keyValue[duplicateField];

        throw new BadRequestException(
          `Le champ '${duplicateField}' avec la valeur '${duplicateValue}' est déjà utilisé.`,
        );
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Une erreur est survenue lors de la mise à jour du profil.',
      );
    }
  }

  async uploadeImageBannerProfile(
    userId: string,
    imageBanner: { url: string; key: string },
  ) {
    console.log(imageBanner);

    try {
      const existingProfile = await this.profileModel.findOne({ userId });

      if (!existingProfile) {
        throw new NotFoundException(
          "Le profil de cet utilisateur n'a pas été trouvé.",
        );
      }

      if (existingProfile.imageBanner.key) {
        await this.CloudinaryService.deleteFile(
          existingProfile.imageBanner.key,
        );
      }
      const updatedProfile = await this.profileModel
        .findByIdAndUpdate(existingProfile._id, { imageBanner }, { new: true })
        .exec();

      if (!updatedProfile) {
        throw new BadRequestException('La mise à jour du profil a échoué.');
      }

      return {
        message: 'Profil mis à jour avec succès.',
        data: updatedProfile,
      };
    } catch (error) {
      if (error && error.code === 11000) {
        console.log('Duplicate key error code:', error.code);

        const duplicateField = Object.keys(error.errorResponse.keyValue)[0];
        const duplicateValue = error.errorResponse.keyValue[duplicateField];

        throw new BadRequestException(
          `Le champ '${duplicateField}' avec la valeur '${duplicateValue}' est déjà utilisé.`,
        );
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Une erreur est survenue lors de la mise à jour du profil.',
      );
    }
  }
}
