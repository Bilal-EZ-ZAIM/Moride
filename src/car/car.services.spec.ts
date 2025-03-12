import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CarService } from './car.service';
import { Car } from './schema/car.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockCarDto = {
  license: '123ABC',
  model: 'Toyota',
  year: '2023',
  transmission: 'Automatic',
  insurance: 'Yes',
  lastMaintenance: new Date().toISOString().split('T')[0],
};

const mockCar = {
  _id: 'carId',
  ...mockCarDto,
  driverId: 'driverId',
  save: jest
    .fn()
    .mockResolvedValue({ ...mockCarDto, driverId: 'driverId', _id: 'carId' }),
};

describe('CarService', () => {
  let service: CarService;
  let carModel: Model<Car>;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: getModelToken(Car.name),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            findById: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            findByIdAndUpdate: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            findByIdAndDelete: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            find: jest.fn().mockReturnValue({
              exec: jest.fn(),
            }),
            create: jest.fn().mockImplementation((dto) => {
              // Mock the constructor behavior
              const newCar = {
                ...dto,
                save: jest.fn().mockResolvedValue({ ...dto, _id: 'carId' }),
              };
              return newCar;
            }),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    carModel = module.get<Model<Car>>(getModelToken(Car.name));
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  describe('create', () => {
    // it('should create a new car', async () => {
    //   (carModel.findOne as jest.Mock).mockReturnValue({
    //     exec: jest.fn().mockResolvedValue(null),
    //   });

    //   const result = await service.create(mockCarDto, 'driverId');
    //   expect(result).toEqual({
    //     ...mockCarDto,
    //     driverId: 'driverId',
    //   });
    // });

    it('should throw BadRequestException if driver already has a car', async () => {
      (carModel.findOne as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCar),
      });

      await expect(service.create(mockCarDto, 'driverId')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if license already exists', async () => {
      (carModel.findOne as jest.Mock)
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue(null),
        })
        .mockReturnValueOnce({
          exec: jest.fn().mockResolvedValue(mockCar),
        });

      await expect(service.create(mockCarDto, 'driverId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all cars', async () => {
      (carModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCar]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockCar]);
    });
  });

  describe('findOne', () => {
    it('should return a car by ID', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCar),
      });

      const result = await service.findOne('carId');
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException if car does not exist', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('carId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockCar,
          driverId: { equals: () => true },
        }),
      });
      (carModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCar),
      });

      const result = await service.update('carId', mockCarDto, 'driverId');
      expect(result).toEqual(mockCar);
    });

    it('should throw NotFoundException if car does not exist', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('carId', mockCarDto, 'driverId'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if driver is not the owner', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockCar,
          driverId: { equals: () => false },
        }),
      });

      await expect(
        service.update('carId', mockCarDto, 'driverId'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a car', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockCar,
          driverId: { equals: () => true },
        }),
      });
      (carModel.findByIdAndDelete as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.delete('carId', 'driverId'),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if car does not exist', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.delete('carId', 'driverId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if driver is not the owner', async () => {
      (carModel.findById as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockCar,
          driverId: { equals: () => false },
        }),
      });

      await expect(service.delete('carId', 'driverId')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
