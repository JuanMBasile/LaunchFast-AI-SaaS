import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { SupabaseService } from '../database/supabase.service';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const supabase = this.supabaseService.getAdminClient();

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      user_metadata: {
        full_name: dto.fullName,
        avatar_url: dto.avatarUrl,
      },
      email_confirm: true,
    });

    if (authError) {
      this.logger.warn(`Registration failed for ${dto.email}: ${authError.message}`);
      if (authError.message.includes('already')) {
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException(authError.message);
    }

    const user = await this.usersService.findById(authData.user.id);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      this.logger.warn(`Login failed for ${dto.email}: invalid credentials`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findById(data.user.id);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      user: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    let payload: { sub: string; type?: string };
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user.id),
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true });
  }

  private generateAccessToken(user: any): string {
    const payload = {
      type: 'access',
      sub: user.id,
      email: user.email,
      plan: user.plan,
      tenantId: user.tenant_id,
    };
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(userId: string): string {
    const payload = { type: 'refresh', sub: userId };
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
    return this.jwtService.sign(payload, { expiresIn: expiresIn as any });
  }
}
