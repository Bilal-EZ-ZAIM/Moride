import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Pricing, PricingDocument } from './schema/pricing.schema';
import { Model, Types } from 'mongoose';
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
    const existingPricing = await this.PricingModel.findOne({ userId });

    if (existingPricing) {
      throw new BadRequestException(
        "L'utilisateur possède déjà une tarification, il ne peut pas en créer une autre.",
      );
    }

    try {
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

  // Lire une tarification (Read)
  async getPricingById(userId: string): Promise<Pricing> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("L'ID utilisateur fourni est invalide.");
    }

    const pricing = await this.PricingModel.findOne({ userId });

    if (!pricing) {
      throw new NotFoundException(
        "La tarification demandée n'a pas été trouvée ou vous n'avez pas les droits pour y accéder.",
      );
    }

    return pricing;
  }

  // Mettre à jour une tarification (Update)
  async updatePricing(
    pricingId: string,
    updatePricingDto: any,
    userId: string,
  ): Promise<Pricing> {
    if (!Types.ObjectId.isValid(pricingId)) {
      throw new BadRequestException(
        "L'ID de tarification fourni est invalide.",
      );
    }

    if (!updatePricingDto || Object.keys(updatePricingDto).length === 0) {
      throw new BadRequestException(
        'Les données de mise à jour sont manquantes.',
      );
    }

    const updatedPricing = await this.PricingModel.findOneAndUpdate(
      { _id: pricingId, userId },
      { $set: updatePricingDto },
      { new: true, runValidators: true },
    );

    if (!updatedPricing) {
      throw new NotFoundException(
        "La tarification demandée n'a pas été trouvée ou vous n'avez pas les droits pour la modifier.",
      );
    }

    return updatedPricing;
  }

  // Supprimer une tarification (Delete)
  async deletePricing(pricingId: string, userId: string): Promise<string> {
    if (!Types.ObjectId.isValid(pricingId)) {
      throw new BadRequestException(
        "L'ID de tarification fourni est invalide.",
      );
    }

    const pricing = await this.PricingModel.findOne({ _id: pricingId, userId });

    if (!pricing) {
      throw new NotFoundException(
        "La tarification demandée n'a pas été trouvée ou vous n'avez pas les droits pour la supprimer.",
      );
    }

    await this.PricingModel.deleteOne({ _id: pricingId });

    return 'La tarification a été supprimée avec succès.';
  }
}
