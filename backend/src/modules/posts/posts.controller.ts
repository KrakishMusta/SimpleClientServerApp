import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

import { Post as PostEntity } from './entities/post.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new post' })
    @ApiResponse({ status: 201, description: 'Post created successfully', type: PostEntity })
    async create(@Req() req, @Body() createPostDto: CreatePostDto): Promise<PostEntity> {
        return this.postsService.create(req.user.id, createPostDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all published posts with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
    async findAll(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('search') search?: string,
    ) {
        return this.postsService.findAll(page, limit, search);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user posts' })
    async getMyPosts(
        @Req() req,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    ) {
        return this.postsService.getUserPosts(req.user.id, page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a post by ID' })
    @ApiResponse({ status: 200, description: 'Post found', type: PostEntity })
    @ApiResponse({ status: 404, description: 'Post not found' })
    async findOne(@Param('id', ParseIntPipe) id: number, @Req() req?) {
        const userId = req?.user?.id;
        return this.postsService.findOne(id, userId);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update a post' })
    @ApiResponse({ status: 200, description: 'Post updated successfully', type: PostEntity })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Req() req,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostEntity> {
        return this.postsService.update(id, req.user.id, updatePostDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a post' })
    @ApiResponse({ status: 204, description: 'Post deleted successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
        return this.postsService.remove(id, req.user.id);
    }

    @Patch(':id/publish')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Toggle post publish status' })
    @ApiResponse({ status: 200, description: 'Post status updated', type: PostEntity })
    async togglePublish(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<PostEntity> {
        return this.postsService.togglePublish(id, req.user.id);
    }
}
