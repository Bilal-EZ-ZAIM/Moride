import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Pricing, PricingDocument } from './schema/pricing.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePricingDto } from './dto/create-pricing.dto';

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(Pricing.name)
    private readonly PricingModel: Model<PricingDocument>,
  ) {}

  // Créer une tarification (Create)
  async createPricing(
    createPricingDto: CreatePricingDto,
    userId: string,
  ): Promise<Pricing> {
    try {
      const existingPricing = await this.PricingModel.findOne({ userId });

      if (existingPricing) {
        throw new BadRequestException(
          "L'utilisateur possède déjà une tarification, il ne peut pas en créer une autre.",
        );
      }

      const pricing = new this.PricingModel({
        ...createPricingDto,
        userId,
      });

      return await pricing.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur interne lors de la création de la tarification',
      );
    }
  }

  async getPricingById(userId: string): Promise<Pricing> {
    const pricing = await this.PricingModel.findOne({
      userId,
    }).exec();
    if (!pricing) {
      throw new NotFoundException(
        "La tarification demandée n'a pas été trouvée ou vous n'avez pas les droits pour y accéder",
      );
    }
    console.log(pricing);
    return pricing;
  }

  async updatePricing(
    pricingId: string,
    updatePricingDto: any,
    userId: string,
  ): Promise<Pricing> {
    try {
      // تحقق من وجود البيانات التي سيتم تحديثها
      if (!updatePricingDto || Object.keys(updatePricingDto).length === 0) {
        throw new BadRequestException(
          'Les données de mise à jour sont manquantes.',
        );
      }

      // محاولة العثور على التسعيرة بناءً على الـ pricingId و الـ userId
      const updatedPricing = await this.PricingModel.findOneAndUpdate(
        { _id: pricingId, userId }, // الشرط: _id و userId
        { $set: updatePricingDto },
        { new: true, runValidators: true },
      ).exec();

      if (!updatedPricing) {
        throw new NotFoundException(
          "La tarification demandée n'a pas été trouvée ou vous n'avez pas les droits pour la modifier",
        );
      }

      console.log('Tarification mise à jour :', updatedPricing);

      return updatedPricing;
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la tarification :',
        error,
      );
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la mise à jour de la tarification.',
      );
    }
  }

  // Supprimer une tarification (Delete)
  async deletePricing(pricingId: string, userId: string): Promise<string> {
    const pricing = await this.PricingModel.findOne({
      _id: pricingId,
      userId,
    }).exec();

    if (!pricing) {
      throw new NotFoundException(
        "La tarification demandée n'a pas été trouvée ou vous n'avez pas les droits pour la supprimer",
      );
    }

    await this.PricingModel.deleteOne({ _id: pricingId });

    return 'La tarification a été supprimée avec succès';
  }
}
