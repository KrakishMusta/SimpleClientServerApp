import { IsString, IsOptional, IsBoolean, IsArray, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
    @ApiProperty({ example: 'My First Post' })
    @IsString()
    @MinLength(3)
    @MaxLength(200)
    title: string;

    @ApiProperty({ example: 'This is the content of my post...', required: false })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean()
    isPublished?: boolean;

    @ApiProperty({ example: ['tag1', 'tag2'], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
