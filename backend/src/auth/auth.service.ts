import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '../database/supabase.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private usersService: UsersService,
    private jwtService: JwtService,
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
      if (authError.message.includes('already')) {
        throw new ConflictException('Email already registered');
      }
      throw new InternalServerErrorException(authError.message);
    }

    const user = await this.usersService.findById(authData.user.id);
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: token,
    };
  }

  async login(dto: LoginDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findById(data.user.id);
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      accessToken: token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private generateToken(user: any): string {
    const payload = {
      sub: user.id,
      email: user.email,
      plan: user.plan,
      tenantId: user.tenant_id,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: any) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      plan: user.plan,
      tenantId: user.tenant_id,
      createdAt: user.created_at,
    };
  }
}
