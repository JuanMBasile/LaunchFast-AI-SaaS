import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose({ name: 'full_name' })
  fullName: string;

  @Expose({ name: 'avatar_url' })
  avatarUrl: string | null;

  @Expose()
  plan: string;

  @Expose({ name: 'tenant_id' })
  tenantId: string | null;

  @Expose({ name: 'created_at' })
  createdAt: string;
}
