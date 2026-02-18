import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../database/repositories/user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    full_name: 'Test',
    plan: 'free',
    stripe_customer_id: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockUser),
            findByEmail: jest.fn().mockResolvedValue(mockUser),
            findByStripeCustomerId: jest.fn().mockResolvedValue(mockUser),
            updatePlan: jest.fn().mockResolvedValue({ ...mockUser, plan: 'pro' }),
            updateStripeCustomerId: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    repository = module.get(UserRepository) as jest.Mocked<UserRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById should delegate to repository', async () => {
    const result = await service.findById('user-1');
    expect(result).toEqual(mockUser);
    expect(repository.findById).toHaveBeenCalledWith('user-1');
  });

  it('findByEmail should delegate to repository', async () => {
    const result = await service.findByEmail('test@example.com');
    expect(result).toEqual(mockUser);
    expect(repository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('findByStripeCustomerId should delegate to repository', async () => {
    const result = await service.findByStripeCustomerId('cus_xxx');
    expect(result).toEqual(mockUser);
    expect(repository.findByStripeCustomerId).toHaveBeenCalledWith('cus_xxx');
  });

  it('updatePlan should delegate to repository', async () => {
    await service.updatePlan('user-1', 'pro');
    expect(repository.updatePlan).toHaveBeenCalledWith('user-1', 'pro');
  });

  it('updateStripeCustomerId should delegate to repository', async () => {
    await service.updateStripeCustomerId('user-1', 'cus_yyy');
    expect(repository.updateStripeCustomerId).toHaveBeenCalledWith('user-1', 'cus_yyy');
  });
});
