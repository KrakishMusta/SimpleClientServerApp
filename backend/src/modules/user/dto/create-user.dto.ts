import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { UserRole } from 'src/enums/enums'; // используем enum

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  name?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  // @ApiProperty({
  //   enum: UserRole,
  //   example: UserRole.PARTICIPANT,
  //   required: false,
  // })
  // @IsOptional()
  // @IsEnum(UserRole)
  // role?: UserRole;

  @ApiProperty({ example: '2000-01-01', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;

  @ApiProperty({ example: 'Москва', required: false })
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiProperty({ enum: ['м', 'ж'], required: false })
  @IsOptional()
  @IsEnum(['м', 'ж'])
  sex?: 'м' | 'ж';

  @ApiProperty({ example: 'http://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 'Россия', required: false })
  @IsOptional()
  @IsString()
  countryId?: string;

  @ApiProperty({ example: '+79123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
