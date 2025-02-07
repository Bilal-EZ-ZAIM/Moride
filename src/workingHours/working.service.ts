import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WorkingDocument, WorkingHours } from './schema/working.schema';
import { CreateWorkingHoursDto } from './dto/create.working.dto';

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectModel(WorkingHours.name)
    private workingModel: Model<WorkingDocument>,
  ) {}

  // Retourne un message simple
  getHello() {
    return 'hello working Hours';
  }

  // Créer un nouvel enregistrement de disponibilités
  async create(
    createWorkingHoursDto: CreateWorkingHoursDto,
    driverId: string,
  ): Promise<WorkingHours> {
    const existingWorkingHours = await this.workingModel.findOne({ driverId });

    if (existingWorkingHours) {
      throw new BadRequestException(
        'Chaque utilisateur ne peut avoir qu’un seul horaire de travail.',
      );
    }

    const newWorkingHours = new this.workingModel({
      ...createWorkingHoursDto,
      driverId,
    });
    return newWorkingHours.save();
  }

  // Récupérer toutes les disponibilités
  async findAll(): Promise<WorkingHours[]> {
    return this.workingModel.find().populate('driverId').exec();
  }

  // Récupérer un enregistrement par ID
  async findOne(id: string): Promise<WorkingHours> {
    const workingHours = await this.workingModel
      .findById(id)
      .populate('driverId')
      .exec();
    if (!workingHours) {
      throw new NotFoundException(
        `Aucune disponibilité trouvée avec l'ID: ${id}`,
      );
    }
    return workingHours;
  }

  // Mettre à jour un enregistrement par ID
  async update(
    id: string,
    updateWorkingHoursDto: CreateWorkingHoursDto,
    driverId: string,
  ): Promise<WorkingHours> {
    const existingWorkingHours = await this.workingModel.findById(id);

    if (!existingWorkingHours) {
      throw new NotFoundException(
        `Impossible de mettre à jour : ID ${id} introuvable.`,
      );
    }

    if (existingWorkingHours.driverId.toString() !== driverId) {
      throw new ForbiddenException(
        "Vous n'avez pas l'autorisation de modifier cet horaire de travail.",
      );
    }

    const updatedWorkingHours = await this.workingModel
      .findByIdAndUpdate(id, updateWorkingHoursDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    return updatedWorkingHours;
  }

  // Supprimer un enregistrement par ID
  async remove(id: string , driverId): Promise<{ message: string }> {
    const existingWorkingHours = await this.workingModel.findById(id);

    if (!existingWorkingHours) {
      throw new NotFoundException(
        `Impossible de mettre à jour : ID ${id} introuvable.`,
      );
    }

    if (existingWorkingHours.driverId.toString() !== driverId) {
      throw new ForbiddenException(
        "Vous n'avez pas l'autorisation de modifier cet horaire de travail.",
      );
    }

    const deleted = await this.workingModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(
        `Impossible de supprimer : ID ${id} introuvable.`,
      );
    }
    return { message: `Disponibilité supprimée avec succès.` };
  }
}
