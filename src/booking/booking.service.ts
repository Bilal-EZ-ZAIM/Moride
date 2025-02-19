import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Booking, BookingDocument } from './schema/booking.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DriverService } from '../driver/driver.service';
import { CreateApplicationDto } from './dto/createa-pplication.dto';
import { AcceptOfferDto } from './dto/accept-offer.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    private driverService: DriverService,
  ) {}

  // Création d'une réservation
  async create(createBookingDto: CreateBookingDto, userId: string) {
    try {
      // Vérification du nombre de passagers
      if (createBookingDto.passengers < 1 || createBookingDto.passengers > 4) {
        throw new BadRequestException(
          'Le nombre de passagers doit être entre 1 et 4.',
        );
      }

      // Création de la réservation
      const booking = new this.bookingModel({
        ...createBookingDto,
        userId: userId,
      });

      // Sauvegarde de la réservation dans la base de données
      await booking.save();

      return {
        message: 'La réservation a été créée avec succès.',
        booking,
      };
    } catch (error) {
      // Gestion des erreurs
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la création de la réservation.',
      );
    }
  }

  // Récupérer toutes les réservations
  async findAll() {
    return await this.bookingModel.find().populate('applicants').exec();
  }

  async findMyBooking(id: string) {
    console.log('test', id);

    return await this.bookingModel.find({ userId: id }).exec();
  }

  // Récupérer une réservation par ID
  async findOne(id: string) {
    const booking = await this.bookingModel
      .findById(id)
      .populate({
        path: 'applicants.driverId',
        select: 'ratings rating',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'imageProfile firstname lastname',
        },
      })
      .exec();

    if (!booking) {
      throw new BadRequestException('Aucune réservation trouvée.');
    }
    return booking;
  }

  // Mettre à jour une réservation
  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new BadRequestException(
        'Aucune réservation trouvée pour la mise à jour.',
      );
    }

    // Vérifier si l'utilisateur est le propriétaire de la réservation

    if (booking.userId !== userId) {
      throw new UnauthorizedException(
        "Vous n'avez pas l'autorisation de modifier cette réservation.",
      );
    }

    // Mise à jour de la réservation
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();

    return {
      message: 'La réservation a été mise à jour avec succès.',
      updatedBooking,
    };
  }

  // Supprimer une réservation
  async remove(id: string, userId: string) {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) {
      throw new BadRequestException('Aucune réservation trouvée à supprimer.');
    }

    // Vérifier si l'utilisateur est le propriétaire de la réservation
    if (booking.userId !== userId) {
      throw new UnauthorizedException(
        "Vous n'avez pas l'autorisation de supprimer cette réservation.",
      );
    }

    // Suppression de la réservation
    await this.bookingModel.findByIdAndDelete(id).exec();

    return {
      message: 'La réservation a été supprimée avec succès.',
    };
  }

  async applyForBooking(
    bookingId: string,
    userId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    const { message, date, time, price } = createApplicationDto;

    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found.');
    }

    const driverId = await this.driverService.getDriver(userId);
    console.log(driverId);

    const isAlreadyApplied = booking.applicants.some(
      (applicant) => applicant.driverId.toString() === driverId.toString(),
    );

    if (isAlreadyApplied) {
      throw new BadRequestException(
        'You have already applied for this booking.',
      );
    }

    booking.applicants.push({
      driverId,
      message,
      date,
      time,
      price,
    });

    await booking.save();

    return { message: 'Application successful', booking };
  }

  async acceptOffer(bookingId: string, data: AcceptOfferDto, userId: string) {
    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Aucune réservation trouvée.');
    }

    console.log(booking.userId);
    console.log(userId);

    if (booking.userId.toString() !== userId.toString()) {
      throw new UnauthorizedException(
        "Vous n'avez pas l'autorisation de modifier cette réservation.",
      );
    }

    

    const offer = booking.applicants.find(
      (applicant) => applicant.driverId.toString() === data.driverId,
    );
    if (!offer) {
      throw new BadRequestException('Aucune offre trouvée de ce chauffeur.');
    }

    if (booking.selectedDriver) {
      throw new BadRequestException('Un chauffeur a déjà été sélectionné.');
    }

    booking.selectedDriver = {
      driverId: offer.driverId,
      confirmation: true,
    };
    booking.finalPrice = data.price;

    await booking.save();

    return {
      message: 'Offre acceptée avec succès.',
      booking,
    };
  }
}
