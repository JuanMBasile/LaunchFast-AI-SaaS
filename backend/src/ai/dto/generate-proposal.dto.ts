import { IsString, IsOptional, MinLength, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class GenerateProposalDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  clientName: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  projectDescription: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  scope: string;

  @IsNumber()
  @Min(1)
  @Max(1000000)
  budget: number;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  timeline: string;

  @IsString()
  @MinLength(3)
  @MaxLength(500)
  skills: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  additionalNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;
}
