import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditRepository } from '../database/repositories/credit.repository';

describe('CreditsService', () => {
  let service: CreditsService;
  let repository: jest.Mocked<CreditRepository>;

  const userId = 'user-1';
  const mockCreditRow = {
    user_id: userId,
    total: 10,
    used: 3,
    remaining: 7,
    reset_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditsService,
        {
          provide: CreditRepository,
          useValue: {
            findByUser: jest.fn().mockResolvedValue(mockCreditRow),
            updateUsed: jest.fn().mockResolvedValue(undefined),
            reset: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get(CreditsService);
    repository = module.get(CreditRepository) as jest.Mocked<CreditRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCredits', () => {
    it('should return credits when user has record', async () => {
      const result = await service.getCredits(userId);
      expect(result).toEqual({
        total: 10,
        used: 3,
        remaining: 7,
        resetAt: mockCreditRow.reset_at,
      });
      expect(repository.findByUser).toHaveBeenCalledWith(userId);
    });

    it('should return zeros when user has no record', async () => {
      repository.findByUser.mockResolvedValueOnce(null);
      const result = await service.getCredits(userId);
      expect(result).toEqual({ total: 0, used: 0, remaining: 0, resetAt: null });
    });
  });

  describe('hasCredits', () => {
    it('should return true when remaining >= amount', async () => {
      expect(await service.hasCredits(userId, 5)).toBe(true);
      expect(await service.hasCredits(userId, 7)).toBe(true);
    });

    it('should return false when remaining < amount', async () => {
      expect(await service.hasCredits(userId, 10)).toBe(false);
    });
  });

  describe('deductCredits', () => {
    it('should call updateUsed with new used value', async () => {
      await service.deductCredits(userId, 2);
      expect(repository.updateUsed).toHaveBeenCalledWith(userId, 5);
    });

    it('should throw ForbiddenException when insufficient credits', async () => {
      await expect(service.deductCredits(userId, 10)).rejects.toThrow(ForbiddenException);
      expect(repository.updateUsed).not.toHaveBeenCalled();
    });
  });

  describe('resetCredits', () => {
    it('should call repository.reset with total', async () => {
      await service.resetCredits(userId, 100);
      expect(repository.reset).toHaveBeenCalledWith(userId, 100);
    });
  });

  describe('upgradeCredits', () => {
    it('should reset to 100', async () => {
      await service.upgradeCredits(userId);
      expect(repository.reset).toHaveBeenCalledWith(userId, 100);
    });
  });

  describe('downgradeCredits', () => {
    it('should reset to 5', async () => {
      await service.downgradeCredits(userId);
      expect(repository.reset).toHaveBeenCalledWith(userId, 5);
    });
  });
});
