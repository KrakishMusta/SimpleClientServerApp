import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import {
  InferAttributes,
  InferCreationAttributes,
  type CreationOptional,
  type NonAttribute,
} from 'sequelize';
import * as bcrypt from 'bcryptjs';
import { Post } from '../../posts/entities/post.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.ENUM('user', 'admin'),
    defaultValue: 'user',
  })
  declare role: CreationOptional<'user' | 'admin'>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified',
  })
  declare isEmailVerified: CreationOptional<boolean>;

  @Column({
    type: DataType.DATE,
    field: 'last_login_at',
    allowNull: true,
  })
  declare lastLoginAt: CreationOptional<Date | null>;

  // 👇 associations НЕ участвуют в create()
  @HasMany(() => Post)
  declare posts: NonAttribute<Post[]>;

  // 👇 virtual поле — НЕ атрибут БД
  @Column({
    type: DataType.VIRTUAL,
    get(this: User) {
      return `${this.username} (${this.email})`;
    },
  })
  declare displayName: NonAttribute<string>;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
