import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { getModelToken } from '@nestjs/mongoose';
import { Pricing } from './schema/pricing.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('PricingService', () => {
  let service: PricingService;
  let mockPricingModel: Model<Pricing>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: getModelToken(Pricing.name),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    mockPricingModel = module.get<Model<Pricing>>(getModelToken(Pricing.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw BadRequestException if user already has a pricing', async () => {
    (mockPricingModel.findOne as jest.Mock).mockResolvedValue({});

    await expect(
      service.createPricing(
        { hourlyRate: 10, kmRate: 2, minimumFare: 15 },
        'userId',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if userId is invalid', async () => {
    await expect(service.getPricingById('invalidId')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if pricing not found by userId', async () => {
    (mockPricingModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.getPricingById('64a1f9e4b6d6a4f1a3e4a1f9'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if pricingId is invalid for update', async () => {
    await expect(
      service.updatePricing('invalidId', { hourlyRate: 20 }, 'userId'),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if pricing not found for update', async () => {
    (mockPricingModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await expect(
      service.updatePricing(
        '64a1f9e4b6d6a4f1a3e4a1f9',
        { hourlyRate: 20 },
        'userId',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if pricingId is invalid for delete', async () => {
    await expect(service.deletePricing('invalidId', 'userId')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if pricing not found for delete', async () => {
    (mockPricingModel.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.deletePricing('64a1f9e4b6d6a4f1a3e4a1f9', 'userId'),
    ).rejects.toThrow(NotFoundException);
  });
});
