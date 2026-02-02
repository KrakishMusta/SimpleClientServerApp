import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload, Tokens } from './interfaces/jwt-payload.interface';

// import { UserRole } from 'src/enums/enums';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(RefreshToken)
    private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Tokens> {
    // Создаем пользователя
    const user = await this.usersService.create({
      ...registerDto,
      // role: UserRole.PARTICIPANT,
    });

    // console.log(`reg`, registerDto, user);
    // Генерируем токены
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<Tokens> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Обновляем время последнего входа
    await user.update({ lastLoginAt: new Date() });

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const token = await this.refreshTokenModel.findOne({
      where: {
        token: refreshToken,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() },
      },
      include: [User],
    });

    console.log('\u001b[1;31mRefresh\u001b[0m', refreshToken);

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Отзываем старый токен
    await token.update({
      isRevoked: true,
      revokedAt: new Date(),
    });

    // Генерируем новые токены
    return this.generateTokens(token.user);
  }

  async logout(userId: number): Promise<void> {
    // Отзываем все refresh токены пользователя
    await this.refreshTokenModel.update(
      { isRevoked: true, revokedAt: new Date() },
      { where: { userId, isRevoked: false } },
    );
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      // role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    // Сохраняем refresh токен в БД
    await this.refreshTokenModel.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getProfile(userId: number): Promise<User> {
    return this.usersService.findOne(userId);
  }
}
