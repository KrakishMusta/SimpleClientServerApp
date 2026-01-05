import {
    IsEmail,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
    IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'john_doe' })
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @Matches(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers and underscores',
    })
    username: string;

    @ApiProperty({ example: 'Password123!' })
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    })
    password: string;

    @ApiProperty({ enum: ['user', 'admin'], required: false })
    @IsOptional()
    @IsEnum(['user', 'admin'])
    role?: string;
}
