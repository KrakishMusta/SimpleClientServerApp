import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    currentPassword?: string;
}
