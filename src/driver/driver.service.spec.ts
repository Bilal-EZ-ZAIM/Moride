import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { DriverService } from './driver.service';
import { Driver } from './schema/driver.schema';
import { CreateDriverDto } from './dto/driver.dto';
import { UpdateDriverDto } from './dto/updqteDriver.dto';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { Gender, DriverStatus } from './schema/driver.schema'; 

describe('DriverService', () => {
  let service: DriverService;
  let model: Model<Driver>;

  const mockDriver: Driver = {
    _id: '1',
    userId: '123',
    licenseNumber: 'ABC123',
    gender: Gender.Male,
    birthdate: new Date(),
    nationality: 'US',
    address: '123 Main St',
    licenseExpirationDate: new Date(),
    drivingExperience: 5,
    status: DriverStatus.Available,
    preferredLanguages: ['English'],
    profile: 'profileId',
  } as Driver;

  const mockDriverModel = {
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getModelToken(Driver.name),
          useValue: mockDriverModel,
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
    model = module.get<Model<Driver>>(getModelToken(Driver.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllDrivers', () => {
    it('should return all drivers', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockDriver]);

      const result = await service.getAllDrivers();

      expect(result).toEqual([mockDriver]);
      expect(model.find).toHaveBeenCalled();
      expect(model.populate).toHaveBeenCalledWith(
        'profile',
        'imageProfile lastname firstname imageBanner',
      );
    });
  });

  describe('createDriver', () => {
    it('should create a new driver', async () => {
      const createDriverDto: CreateDriverDto = {
        gender: Gender.Male,
        birthdate: new Date(),
        nationality: 'US',
        address: '123 Main St',
        licenseNumber: 'ABC123',
        licenseExpirationDate: new Date(),
        drivingExperience: 5,
        status: DriverStatus.Available,
        preferredLanguages: ['English'],
        profile: 'profileId',
      };

      jest.spyOn(model, 'findOne').mockResolvedValue(null);
      jest.spyOn(model, 'create').mockResolvedValue(mockDriver);

      const result = await service.createDriver(createDriverDto, '123');

      expect(result).toEqual({
        message: 'Le conducteur a été créé avec succès.',
        driver: mockDriver,
      });
      expect(model.findOne).toHaveBeenCalledWith({ userId: '123' });
      expect(model.findOne).toHaveBeenCalledWith({ licenseNumber: 'ABC123' });
      expect(model.create).toHaveBeenCalledWith({
        ...createDriverDto,
        userId: '123',
      });
    });

    it('should throw BadRequestException if driver with userId already exists', async () => {
      const createDriverDto: CreateDriverDto = {
        gender: Gender.Male,
        birthdate: new Date(),
        nationality: 'US',
        address: '123 Main St',
        licenseNumber: 'ABC123',
        licenseExpirationDate: new Date(),
        drivingExperience: 5,
        status: DriverStatus.Available,
        preferredLanguages: ['English'],
        profile: 'profileId',
      };

      jest.spyOn(model, 'findOne').mockResolvedValue(mockDriver);

      await expect(service.createDriver(createDriverDto, '123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if driver with licenseNumber already exists', async () => {
      const createDriverDto: CreateDriverDto = {
        gender: Gender.Male,
        birthdate: new Date(),
        nationality: 'US',
        address: '123 Main St',
        licenseNumber: 'ABC123',
        licenseExpirationDate: new Date(),
        drivingExperience: 5,
        status: DriverStatus.Available,
        preferredLanguages: ['English'],
        profile: 'profileId',
      };

      jest
        .spyOn(model, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockDriver);

      await expect(service.createDriver(createDriverDto, '123')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateDriver', () => {
    it('should update a driver', async () => {
      const updateDriverDto: UpdateDriverDto = {
        licenseNumber: 'XYZ789',
      };

      jest.spyOn(model, 'findOne').mockResolvedValue(mockDriver);
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockDriver);

      const result = await service.updateDriver('1', updateDriverDto);

      expect(result).toEqual({
        message: 'Le conducteur a été mis à jour avec succès.',
        driver: mockDriver,
      });
      expect(model.findOne).toHaveBeenCalledWith({ userId: '1' });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updateDriverDto,
        { new: true },
      );
    });

    it('should throw BadRequestException if driver does not exist', async () => {
      const updateDriverDto: UpdateDriverDto = {
        licenseNumber: 'XYZ789',
      };

      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(service.updateDriver('1', updateDriverDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if licenseNumber is already used by another driver', async () => {
      const updateDriverDto: UpdateDriverDto = {
        licenseNumber: 'XYZ789',
      };

      jest
        .spyOn(model, 'findOne')
        .mockResolvedValueOnce(mockDriver)
        .mockResolvedValueOnce({ _id: '2', licenseNumber: 'XYZ789' });

      await expect(service.updateDriver('1', updateDriverDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getDriver', () => {
    it('should return driver id if driver exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockDriver);

      const result = await service.getDriver('123');

      expect(result).toEqual(mockDriver._id);
      expect(model.findOne).toHaveBeenCalledWith({ userId: '123' });
    });

    it('should throw HttpException if driver does not exist', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(service.getDriver('123')).rejects.toThrow(HttpException);
    });
  });

  describe('getDriverProfile', () => {
    it('should return driver profile if driver exists', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockDriver);

      const result = await service.getDriverProfile('123');

      expect(result).toEqual(mockDriver);
      expect(model.findOne).toHaveBeenCalledWith({ userId: '123' });
    });

    it('should throw HttpException if driver does not exist', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(null);

      await expect(service.getDriverProfile('123')).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getDriverById', () => {
    it('should return driver by id if driver exists', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockDriver);

      const result = await service.getDriverById('1');

      expect(result).toEqual(mockDriver);
      expect(model.findById).toHaveBeenCalledWith('1');
    });

    it('should throw HttpException if driver does not exist', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);

      await expect(service.getDriverById('1')).rejects.toThrow(HttpException);
    });
  });
});