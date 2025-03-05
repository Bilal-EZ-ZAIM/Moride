import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkingDocument, WorkingHours } from './schema/working.schema';
import { CreateWorkingHoursDto } from './dto/create.working.dto';

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectModel(WorkingHours.name)
    private workingModel: Model<WorkingDocument>,
  ) {}

  async create(
    createWorkingHoursDto: CreateWorkingHoursDto,
    driverId: string,
  ): Promise<any> {
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

    await newWorkingHours.save();
    return {
      message: 'Horaire de travail créé avec succès.',
      data: newWorkingHours,
    };
  }

  async findAll(): Promise<any> {
    const workingHours = await this.workingModel
      .find()
      .populate('driverId')
      .exec();
    return {
      message: 'Liste des horaires de travail récupérée avec succès.',
      data: workingHours,
    };
  }

  async findOne(id: string): Promise<any> {
    const workingHours = await this.workingModel.findById(id).exec();
    if (!workingHours) {
      throw new NotFoundException(
        `Aucune disponibilité trouvée avec l'ID: ${id}`,
      );
    }
    return {
      message: 'Disponibilité trouvée avec succès.',
      data: workingHours,
    };
  }

  async findOneByDriver(id: string): Promise<any> {
    console.log(id);

    const workingHours = await this.workingModel
      .findOne({ driverId: id })
      .exec();
    if (!workingHours) {
      throw new NotFoundException(
        `Aucune disponibilité trouvée avec l'ID: ${id}`,
      );
    }
    return {
      message: 'Disponibilité trouvée avec succès.',
      data: workingHours,
    };
  }

  async getDriverWorkSchedule(id: string): Promise<any> {
    const objectId = new Types.ObjectId(id);

    const workingHours = await this.workingModel
      .findOne({ driverId: objectId })
      .exec();

    if (!workingHours) {
      throw new NotFoundException(
        `Aucune disponibilité trouvée avec l'ID: ${id}`,
      );
    }

    return {
      message: 'Disponibilité trouvée avec succès.',
      data: workingHours,
    };
  }
  async update(
    id: string,
    updateWorkingHoursDto: CreateWorkingHoursDto,
    driverId: string,
  ): Promise<any> {
    const existingWorkingHours = await this.workingModel.findById(id);
    console.log(existingWorkingHours);

    if (!existingWorkingHours) {
      throw new NotFoundException(
        `Impossible de mettre à jour : ID ${id} introuvable.`,
      );
    }

    if (existingWorkingHours.driverId.toString() !== driverId.toString()) {
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

    return {
      message: 'Horaire de travail mis à jour avec succès.',
      data: updatedWorkingHours,
    };
  }

  async remove(id: string, driverId: string): Promise<any> {
    const existingWorkingHours = await this.workingModel.findById(id);

    if (!existingWorkingHours) {
      throw new NotFoundException(
        `Impossible de supprimer : ID ${id} introuvable.`,
      );
    }

    if (existingWorkingHours.driverId.toString() !== driverId.toString()) {
      throw new ForbiddenException(
        "Vous n'avez pas l'autorisation de supprimer cet horaire de travail.",
      );
    }

    await this.workingModel.findByIdAndDelete(id).exec();
    return {
      message: `Disponibilité supprimée avec succès.`,
    };
  }
}
