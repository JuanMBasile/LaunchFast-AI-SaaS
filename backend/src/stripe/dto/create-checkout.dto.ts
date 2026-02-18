import { IsString, IsIn } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @IsIn(['pro'])
  plan: string;
}
