import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getModelToken } from '@nestjs/mongoose';
import { Booking } from './schema/booking.schema';
import { DriverService } from '../driver/driver.service';
import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CreateApplicationDto } from './dto/createa-pplication.dto';
import { AcceptOfferDto } from './dto/accept-offer.dto';

describe('BookingService', () => {
  let service: BookingService;
  let bookingModel: Model<Booking>;
  let driverService: DriverService;

  const mockBookingModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    new: jest.fn().mockResolvedValue({
      save: jest.fn(),
    }),
    constructor: jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({
        _id: 'mockBookingId',
        userId: 'mockUserId',
        profileId: 'mockProfileId',
        from: 'Paris',
        to: 'Lyon',
        date: '2025-03-06',
        time: '14:00',
        passengers: 2,
        tripType: 'private',
        priceFrom: '100',
        priceTo: '150',
        applicants: [],
      }),
      ...mockBookingModel,
    })),
  };

  const mockDriverService = {
    getDriver: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getModelToken(Booking.name),
          useValue: mockBookingModel,
        },
        {
          provide: DriverService,
          useValue: mockDriverService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingModel = module.get<Model<Booking>>(getModelToken(Booking.name));
    driverService = module.get<DriverService>(DriverService);
  });

  // Reset mocks before each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException when passengers count is invalid', async () => {
      const userId = 'mockUserId';
      const profileId = 'mockProfileId';

      // Test with too many passengers
      const invalidBookingDtoTooMany: CreateBookingDto = {
        from: 'Paris',
        to: 'Lyon',
        date: '2025-03-06',
        time: '14:00',
        passengers: 5, // More than allowed
        tripType: 'private',
        priceFrom: '100',
        priceTo: '150',
      };

      await expect(
        service.create(invalidBookingDtoTooMany, userId, profileId),
      ).rejects.toThrow(BadRequestException);

      // Test with too few passengers
      const invalidBookingDtoTooFew: CreateBookingDto = {
        from: 'Paris',
        to: 'Lyon',
        date: '2025-03-06',
        time: '14:00',
        passengers: 0, // Less than allowed
        tripType: 'private',
        priceFrom: '100',
        priceTo: '150',
      };

      await expect(
        service.create(invalidBookingDtoTooFew, userId, profileId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const mockBookings = [
        { _id: '1', from: 'Paris', to: 'Lyon' },
        { _id: '2', from: 'Marseille', to: 'Nice' },
      ];

      const mockExec = jest.fn().mockResolvedValue(mockBookings);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(mockBookingModel, 'find').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findAll();

      expect(mockBookingModel.find).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith(
        'profileId',
        'firstname lastname imageProfile',
      );
      expect(result).toEqual(mockBookings);
    });
  });

  describe('findMyBooking', () => {
    it('should return bookings for a specific user', async () => {
      const userId = 'mockUserId';
      const mockBookings = [{ _id: '1', userId, from: 'Paris', to: 'Lyon' }];

      const mockExec = jest.fn().mockResolvedValue(mockBookings);
      const mockPopulate = jest.fn().mockReturnValue({ exec: mockExec });

      jest.spyOn(mockBookingModel, 'find').mockReturnValue({
        populate: mockPopulate,
      } as any);

      const result = await service.findMyBooking(userId);

      expect(mockBookingModel.find).toHaveBeenCalledWith({ userId });
      expect(result).toEqual(mockBookings);
    });
  });

  describe('findOne', () => {
    it('should return a single booking by id', async () => {
      const bookingId = 'mockBookingId';
      const mockBooking = {
        _id: bookingId,
        from: 'Paris',
        to: 'Lyon',
      };

      const mockExec = jest.fn().mockResolvedValue(mockBooking);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockExec,
      } as any);

      const result = await service.findOne(bookingId);

      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(result).toEqual(mockBooking);
    });

    it('should throw BadRequestException when booking not found', async () => {
      const bookingId = 'nonExistentId';

      const mockExec = jest.fn().mockResolvedValue(null);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockExec,
      } as any);

      await expect(service.findOne(bookingId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a booking when the user is the owner', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockUserId';
      const updateBookingDto: UpdateBookingDto = { passengers: 3 };

      const mockBooking = {
        _id: bookingId,
        userId,
        from: 'Paris',
        to: 'Lyon',
      };

      const mockUpdatedBooking = {
        ...mockBooking,
        passengers: 3,
      };

      const mockFindByIdExec = jest.fn().mockResolvedValue(mockBooking);
      const mockFindByIdAndUpdateExec = jest
        .fn()
        .mockResolvedValue(mockUpdatedBooking);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockFindByIdExec,
      } as any);

      jest.spyOn(mockBookingModel, 'findByIdAndUpdate').mockReturnValue({
        exec: mockFindByIdAndUpdateExec,
      } as any);

      const result = await service.update(bookingId, updateBookingDto, userId);

      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(mockBookingModel.findByIdAndUpdate).toHaveBeenCalledWith(
        bookingId,
        updateBookingDto,
        { new: true },
      );
      expect(result).toHaveProperty(
        'message',
        'La réservation a été mise à jour avec succès.',
      );
      expect(result).toHaveProperty('updatedBooking', mockUpdatedBooking);
    });

    it('should throw BadRequestException when booking not found', async () => {
      const bookingId = 'nonExistentId';
      const userId = 'mockUserId';
      const updateBookingDto: UpdateBookingDto = { passengers: 3 };

      const mockFindByIdExec = jest.fn().mockResolvedValue(null);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockFindByIdExec,
      } as any);

      await expect(
        service.update(bookingId, updateBookingDto, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException when user is not the owner', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'differentUserId';
      const updateBookingDto: UpdateBookingDto = { passengers: 3 };

      const mockBooking = {
        _id: bookingId,
        userId: 'mockUserId', // Different from userId
        from: 'Paris',
        to: 'Lyon',
      };

      const mockFindByIdExec = jest.fn().mockResolvedValue(mockBooking);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockFindByIdExec,
      } as any);

      await expect(
        service.update(bookingId, updateBookingDto, userId),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a booking when the user is the owner', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockUserId';

      const mockBooking = {
        _id: bookingId,
        userId,
        from: 'Paris',
        to: 'Lyon',
      };

      const mockFindByIdExec = jest.fn().mockResolvedValue(mockBooking);
      const mockFindByIdAndDeleteExec = jest.fn().mockResolvedValue({});

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockFindByIdExec,
      } as any);

      jest.spyOn(mockBookingModel, 'findByIdAndDelete').mockReturnValue({
        exec: mockFindByIdAndDeleteExec,
      } as any);

      const result = await service.remove(bookingId, userId);

      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(mockBookingModel.findByIdAndDelete).toHaveBeenCalledWith(
        bookingId,
      );
      expect(result).toHaveProperty(
        'message',
        'La réservation a été supprimée avec succès.',
      );
    });

    it('should throw BadRequestException when booking not found', async () => {
      const bookingId = 'nonExistentId';
      const userId = 'mockUserId';

      const mockFindByIdExec = jest.fn().mockResolvedValue(null);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockFindByIdExec,
      } as any);

      await expect(service.remove(bookingId, userId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw UnauthorizedException when user is not the owner', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'differentUserId';

      const mockBooking = {
        _id: bookingId,
        userId: 'mockUserId', // Different from userId
        from: 'Paris',
        to: 'Lyon',
      };

      const mockFindByIdExec = jest.fn().mockResolvedValue(mockBooking);

      jest.spyOn(mockBookingModel, 'findById').mockReturnValue({
        exec: mockFindByIdExec,
      } as any);

      await expect(service.remove(bookingId, userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('applyForBooking', () => {
    it('should allow a driver to apply for a booking', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockDriverId';
      const driverId = 'driverDocumentId';

      const createApplicationDto: CreateApplicationDto = {
        message: 'I can drive you',
        date: '2025-03-06',
        time: '14:00',
        price: 100,
      };

      const mockBooking = {
        _id: bookingId,
        applicants: [],
        save: jest.fn().mockResolvedValue({
          _id: bookingId,
          applicants: [
            {
              driverId,
              ...createApplicationDto,
            },
          ],
        }),
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(mockBooking);
      jest.spyOn(mockDriverService, 'getDriver').mockResolvedValue(driverId);

      const result = await service.applyForBooking(
        bookingId,
        userId,
        createApplicationDto,
      );

      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(mockDriverService.getDriver).toHaveBeenCalledWith(userId);
      expect(mockBooking.save).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Application successful');
    });

    it('should throw NotFoundException when booking not found', async () => {
      const bookingId = 'nonExistentId';
      const userId = 'mockDriverId';

      const createApplicationDto: CreateApplicationDto = {
        message: 'I can drive you',
        date: '2025-03-06',
        time: '14:00',
        price: 100,
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(null);

      await expect(
        service.applyForBooking(bookingId, userId, createApplicationDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when driver has already applied', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockDriverId';
      const driverId = 'driverDocumentId';

      const createApplicationDto: CreateApplicationDto = {
        message: 'I can drive you',
        date: '2025-03-06',
        time: '14:00',
        price: 100,
      };

      const mockBooking = {
        _id: bookingId,
        applicants: [
          {
            driverId,
            message: 'Previous application',
            date: '2025-03-06',
            time: '15:00',
            price: 120,
          },
        ],
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(mockBooking);
      jest.spyOn(mockDriverService, 'getDriver').mockResolvedValue(driverId);

      await expect(
        service.applyForBooking(bookingId, userId, createApplicationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('acceptOffer', () => {
    it('should allow booking owner to accept a driver offer', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockUserId';
      const driverId = 'mockDriverId';

      const acceptOfferDto: AcceptOfferDto = {
        driverId,
      };

      const mockBooking = {
        _id: bookingId,
        userId,
        applicants: [
          {
            driverId,
            message: 'I can drive you',
            status: 'pending',
          },
        ],
        selectedDriver: null,
        save: jest.fn().mockResolvedValue({
          _id: bookingId,
          userId,
          applicants: [
            {
              driverId,
              message: 'I can drive you',
              status: 'accepted',
            },
          ],
          selectedDriver: {
            driverId,
            confirmation: true,
          },
        }),
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(mockBooking);

      const result = await service.acceptOffer(
        bookingId,
        acceptOfferDto,
        userId,
      );

      expect(mockBookingModel.findById).toHaveBeenCalledWith(bookingId);
      expect(mockBooking.save).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Offre acceptée avec succès.');
      expect(result.booking.selectedDriver).toEqual({
        driverId,
        confirmation: true,
      });
    });

    it('should throw NotFoundException when booking not found', async () => {
      const bookingId = 'nonExistentId';
      const userId = 'mockUserId';
      const driverId = 'mockDriverId';

      const acceptOfferDto: AcceptOfferDto = {
        driverId,
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(null);

      await expect(
        service.acceptOffer(bookingId, acceptOfferDto, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException when user is not the booking owner', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'differentUserId';
      const bookingOwnerId = 'mockUserId';
      const driverId = 'mockDriverId';

      const acceptOfferDto: AcceptOfferDto = {
        driverId,
      };

      const mockBooking = {
        _id: bookingId,
        userId: bookingOwnerId, // Different from userId
        toString: () => bookingOwnerId,
        applicants: [
          {
            driverId,
            message: 'I can drive you',
          },
        ],
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(mockBooking);

      await expect(
        service.acceptOffer(bookingId, acceptOfferDto, userId),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException when driver offer not found', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockUserId';
      const driverId = 'mockDriverId';
      const differentDriverId = 'differentDriverId';

      const acceptOfferDto: AcceptOfferDto = {
        driverId: differentDriverId, // Not in applicants list
      };

      const mockBooking = {
        _id: bookingId,
        userId,
        toString: () => userId,
        applicants: [
          {
            driverId,
            message: 'I can drive you',
          },
        ],
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(mockBooking);

      await expect(
        service.acceptOffer(bookingId, acceptOfferDto, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when a driver is already selected', async () => {
      const bookingId = 'mockBookingId';
      const userId = 'mockUserId';
      const driverId = 'mockDriverId';

      const acceptOfferDto: AcceptOfferDto = {
        driverId,
      };

      const mockBooking = {
        _id: bookingId,
        userId,
        toString: () => userId,
        applicants: [
          {
            driverId,
            message: 'I can drive you',
          },
        ],
        selectedDriver: {
          driverId: 'anotherDriverId',
          confirmation: true,
        },
      };

      jest.spyOn(mockBookingModel, 'findById').mockResolvedValue(mockBooking);

      await expect(
        service.acceptOffer(bookingId, acceptOfferDto, userId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
