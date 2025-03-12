import { Test, TestingModule } from '@nestjs/testing';
import { WorkingHoursService } from './working.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WorkingHours, WorkingDocument } from './schema/working.schema';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkingHoursDto } from './dto/create.working.dto';

describe('WorkingHoursService', () => {
  let service: WorkingHoursService;
  let model: Model<WorkingDocument>;

  // Mock the mongoose model
  const mockWorkingModel = {
    findOne: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  const mockWorkingHours = {
    _id: 'workingId',
    driverId: 'driverId',
    weekSchedule: {
      monday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      thursday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      friday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      saturday: { isWorking: false, startTime: null, endTime: null },
      sunday: { isWorking: false, startTime: null, endTime: null },
    },
    save: jest.fn().mockResolvedValue(true),
    toJSON: jest.fn().mockReturnThis(),
    toObject: jest.fn().mockReturnThis(),
  };

  const mockCreateWorkingHoursDto: CreateWorkingHoursDto = {
    weekSchedule: {
      monday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      thursday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      friday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
      saturday: { isWorking: false, startTime: null, endTime: null },
      sunday: { isWorking: false, startTime: null, endTime: null },
    },
  };

  // Mock the constructor function
  class MockModel {
    constructor(dto) {
      return {
        ...dto,
        save: jest.fn().mockResolvedValue(mockWorkingHours),
      };
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkingHoursService,
        {
          provide: getModelToken(WorkingHours.name),
          // Use the MockModel class as the useValue
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<WorkingHoursService>(WorkingHoursService);
    model = module.get<Model<WorkingDocument>>(
      getModelToken(WorkingHours.name),
    );

    // Restore the original methods for the model
    Object.assign(model, mockWorkingModel);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new working hours schedule', async () => {
      // Fix the first issue: create method testing
      mockWorkingModel.findOne.mockResolvedValue(null);

      // MockModel already has a save method returning mockWorkingHours
      const result = await service.create(
        mockCreateWorkingHoursDto,
        'driverId',
      );

      expect(result.message).toBe('Horaire de travail créé avec succès.');
      expect(result.data).toBeDefined();
    });

    it('should throw BadRequestException if driver already has working hours', async () => {
      mockWorkingModel.findOne.mockResolvedValue(mockWorkingHours);

      await expect(
        service.create(mockCreateWorkingHoursDto, 'driverId'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all working hours', async () => {
      mockWorkingModel.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockWorkingHours]),
        }),
      });

      const result = await service.findAll();
      expect(result.message).toBe(
        'Liste des horaires de travail récupérée avec succès.',
      );
      expect(result.data).toEqual([mockWorkingHours]);
    });
  });

  describe('findOne', () => {
    it('should return a specific working hours by id', async () => {
      mockWorkingModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWorkingHours),
      });

      const result = await service.findOne('workingId');
      expect(result.message).toBe('Disponibilité trouvée avec succès.');
      expect(result.data).toEqual(mockWorkingHours);
    });

    it('should throw NotFoundException if working hours not found', async () => {
      mockWorkingModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('nonExistentId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByDriver', () => {
    it('should return working hours for a specific driver', async () => {
      mockWorkingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWorkingHours),
      });

      const result = await service.findOneByDriver('driverId');
      expect(result.message).toBe('Disponibilité trouvée avec succès.');
      expect(result.data).toEqual(mockWorkingHours);
    });

    it('should throw NotFoundException if no working hours found for driver', async () => {
      mockWorkingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOneByDriver('nonExistentDriverId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getDriverWorkSchedule', () => {
    // Fix the second issue: mock the ObjectId for getDriverWorkSchedule
    it('should return a driver work schedule', async () => {
      // Mock the Types.ObjectId constructor
      jest.spyOn(Types, 'ObjectId').mockImplementation(
        () =>
          ({
            toString: () => 'mockObjectId',
          }) as any,
      );

      mockWorkingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWorkingHours),
      });

      // Use a valid MongoDB ObjectId format
      const result = await service.getDriverWorkSchedule(
        '507f1f77bcf86cd799439011',
      );
      expect(result.message).toBe('Disponibilité trouvée avec succès.');
      expect(result.data).toEqual(mockWorkingHours);
    });

    it('should throw NotFoundException if driver work schedule not found', async () => {
      // Mock the Types.ObjectId constructor
      jest.spyOn(Types, 'ObjectId').mockImplementation(
        () =>
          ({
            toString: () => 'mockObjectId',
          }) as any,
      );

      mockWorkingModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // Use a valid MongoDB ObjectId format
      await expect(
        service.getDriverWorkSchedule('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update working hours', async () => {
      const updatedWorkingHours = { ...mockWorkingHours };
      mockWorkingModel.findById.mockResolvedValue({
        ...mockWorkingHours,
        driverId: {
          toString: () => 'driverId',
        },
      });

      mockWorkingModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedWorkingHours),
      });

      const result = await service.update(
        'workingId',
        mockCreateWorkingHoursDto,
        'driverId',
      );
      expect(result.message).toBe('Horaire de travail mis à jour avec succès.');
      expect(result.data).toEqual(updatedWorkingHours);
    });

    it('should throw NotFoundException if working hours to update not found', async () => {
      mockWorkingModel.findById.mockResolvedValue(null);

      await expect(
        service.update('nonExistentId', mockCreateWorkingHoursDto, 'driverId'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if driver tries to update another driver work hours', async () => {
      mockWorkingModel.findById.mockResolvedValue({
        ...mockWorkingHours,
        driverId: {
          toString: () => 'otherDriverId',
        },
      });

      await expect(
        service.update('workingId', mockCreateWorkingHoursDto, 'driverId'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove working hours', async () => {
      mockWorkingModel.findById.mockResolvedValue({
        ...mockWorkingHours,
        driverId: {
          toString: () => 'driverId',
        },
      });

      mockWorkingModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(true),
      });

      const result = await service.remove('workingId', 'driverId');
      expect(result.message).toBe('Disponibilité supprimée avec succès.');
    });

    it('should throw NotFoundException if working hours to remove not found', async () => {
      mockWorkingModel.findById.mockResolvedValue(null);

      await expect(service.remove('nonExistentId', 'driverId')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if driver tries to remove another driver work hours', async () => {
      mockWorkingModel.findById.mockResolvedValue({
        ...mockWorkingHours,
        driverId: {
          toString: () => 'otherDriverId',
        },
      });

      await expect(service.remove('workingId', 'driverId')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
