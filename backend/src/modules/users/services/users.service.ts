import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserPaginatedResponse } from './interfaces/user.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await this.userModel.findOne({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Проверяем, существует ли пользователь с таким username
        const existingUsername = await this.userModel.findOne({
            where: { username: createUserDto.username },
        });

        if (existingUsername) {
            throw new ConflictException('User with this username already exists');
        }

        return this.userModel.create(createUserDto);
    }

    async findAll(page = 1, limit = 10, search?: string): Promise<IUserPaginatedResponse> {
        const offset = (page - 1) * limit;
        const where: any = {};

        if (search) {
            where[Op.or] = [
                { email: { [Op.like]: `%${search}%` } },
                { username: { [Op.like]: `%${search}%` } },
            ];
        }

        const { rows, count } = await this.userModel.findAndCountAll({
            where,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }, // Не возвращаем пароль
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

    async findOne(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Если меняем email, проверяем что он не занят
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existingUser = await this.userModel.findOne({
                where: { email: updateUserDto.email },
            });

            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }
        }

        // Если меняем username, проверяем что он не занят
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUsername = await this.userModel.findOne({
                where: { username: updateUserDto.username },
            });

            if (existingUsername) {
                throw new ConflictException('User with this username already exists');
            }
        }

        // Если меняем пароль, проверяем текущий
        if (updateUserDto.password) {
            if (!updateUserDto.currentPassword) {
                throw new BadRequestException('Current password is required to change password');
            }

            const isValidPassword = await user.comparePassword(updateUserDto.currentPassword);
            if (!isValidPassword) {
                throw new BadRequestException('Current password is incorrect');
            }
        }

        await user.update(updateUserDto);

        // Возвращаем без пароля
        const updatedUser = await this.findOne(id);
        return updatedUser;
    }

    async remove(id: number): Promise<void> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await user.destroy();
    }

    async softRemove(id: number): Promise<void> {
        const user = await this.userModel.findByPk(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        await user.destroy();
    }

    async restore(id: number): Promise<User> {
        const user = await this.userModel.findByPk(id, { paranoid: false });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (!user.deletedAt) {
            throw new BadRequestException(`User with ID ${id} is not deleted`);
        }

        await user.restore();
        return this.findOne(id);
    }
}
