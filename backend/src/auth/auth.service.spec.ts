import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { SupabaseService } from '../database/supabase.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let supabaseService: jest.Mocked<SupabaseService>;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    full_name: 'Test User',
    plan: 'free',
    tenant_id: 't1',
    created_at: new Date().toISOString(),
  };

  beforeEach(async () => {
    const mockSupabaseClient = {
      auth: {
        admin: {
          createUser: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
        },
        signInWithPassword: jest.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token'),
            verify: jest.fn().mockReturnValue({ sub: 'user-1', type: 'refresh' }),
          },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('7d') },
        },
        {
          provide: SupabaseService,
          useValue: {
            getAdminClient: jest.fn().mockReturnValue(mockSupabaseClient),
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    service = module.get(AuthService);
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    supabaseService = module.get(SupabaseService) as jest.Mocked<SupabaseService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should return user, accessToken and refreshToken on success', async () => {
      const dto = { email: 'new@example.com', password: 'password123', fullName: 'New User' };
      const result = await service.register(dto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
      expect(result.user).toMatchObject({ email: mockUser.email, fullName: mockUser.full_name });
      expect(usersService.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw ConflictException when email already registered', async () => {
      const adminClient = supabaseService.getAdminClient();
      (adminClient.auth.admin.createUser as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'User already registered' },
      });
      await expect(
        service.register({ email: 'x@x.com', password: 'pass', fullName: 'X' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return user, accessToken and refreshToken on success', async () => {
      const result = await service.login({ email: 'test@example.com', password: 'secret' });
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
      expect(result.user).toBeDefined();
      expect(usersService.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const client = supabaseService.getClient();
      (client.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid login' },
      });
      await expect(
        service.login({ email: 'x@x.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should return new accessToken and refreshToken when refresh token is valid', async () => {
      const result = await service.refreshToken('valid-refresh-token');
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
      expect(jwtService.verify).toHaveBeenCalledWith('valid-refresh-token');
      expect(usersService.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jwtService.verify.mockImplementationOnce(() => {
        throw new Error('invalid');
      });
      await expect(service.refreshToken('bad-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when token type is not refresh', async () => {
      jwtService.verify.mockReturnValueOnce({ sub: 'user-1', type: 'access' });
      await expect(service.refreshToken('access-token')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findById.mockResolvedValueOnce(null as any);
      await expect(service.refreshToken('valid-refresh-token')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getProfile', () => {
    it('should return user profile when user exists', async () => {
      const result = await service.getProfile('user-1');
      expect(result).toMatchObject({ email: mockUser.email, fullName: mockUser.full_name });
      expect(usersService.findById).toHaveBeenCalledWith('user-1');
    });

    it('should throw UnauthorizedException when user not found', async () => {
      usersService.findById.mockRejectedValueOnce(new Error('Not found'));
      await expect(service.getProfile('missing')).rejects.toThrow();
    });
  });
});
