import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post)
        private postModel: typeof Post,
    ) {}

    async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
        return this.postModel.create({
            ...createPostDto,
            userId,
        });
    }

    async findAll(page = 1, limit = 10, search?: string, userId?: number, publishedOnly = true) {
        const offset = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { content: { [Op.like]: `%${search}%` } },
            ];
        }

        if (userId) {
            where.userId = userId;
        }

        if (publishedOnly) {
            where.isPublished = true;
        }

        const { rows, count } = await this.postModel.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        return {
            data: rows,
            meta: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    async findOne(id: number, userId?: number): Promise<Post> {
        const post = await this.postModel.findByPk(id);

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        // Проверяем доступ
        if (userId && post.userId !== userId && !post.isPublished) {
            throw new ForbiddenException('You do not have permission to view this post');
        }

        // Увеличиваем счетчик просмотров
        if (post.isPublished) {
            await post.increment('views');
        }

        return post;
    }

    async update(id: number, userId: number, updatePostDto: UpdatePostDto): Promise<Post> {
        const post = await this.postModel.findByPk(id);

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        // Проверяем, что пользователь является автором
        if (post.userId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        await post.update(updatePostDto);
        return post;
    }

    async remove(id: number, userId: number): Promise<void> {
        const post = await this.postModel.findByPk(id);

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        // Проверяем, что пользователь является автором или админом
        if (post.userId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        await post.destroy();
    }

    async getUserPosts(userId: number, page = 1, limit = 10) {
        return this.findAll(page, limit, undefined, userId, false);
    }

    async togglePublish(id: number, userId: number): Promise<Post> {
        const post = await this.postModel.findByPk(id);

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only publish your own posts');
        }

        await post.update({ isPublished: !post.isPublished });
        return post;
    }
}
