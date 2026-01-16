// import { UserRole } from 'src/enums/enums';
import {
  Table,
  Column,
  Model,
  DataType,
  // HasMany,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import * as bcrypt from 'bcryptjs';
// import { Post } from '../../posts/entities/post.entity'; // обычный импорт, нужен для runtime

@Table({
  tableName: 'user',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare name: CreationOptional<string | null>;

  @Column({ type: DataType.STRING, allowNull: false })
  declare password: string;

  // @Column({
  //   type: DataType.ENUM(...Object.values(UserRole)),
  //   defaultValue: UserRole.PARTICIPANT,
  // })
  // declare role: CreationOptional<UserRole>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified',
  })
  declare isEmailVerified: CreationOptional<boolean>;

  @Column({ type: DataType.DATE, field: 'last_login_at', allowNull: true })
  declare lastLoginAt: CreationOptional<Date | null>;

  @Column({ type: DataType.DATE, field: 'birth_date', allowNull: true })
  declare birthDate: CreationOptional<Date | null>;

  @Column({ type: DataType.STRING, allowNull: true })
  declare areaId: CreationOptional<string | null>;

  @Column({ type: DataType.ENUM('м', 'ж'), allowNull: true })
  declare sex: CreationOptional<'м' | 'ж' | null>;

  @Column({ type: DataType.STRING, allowNull: true })
  declare photo: CreationOptional<string | null>;

  @Column({ type: DataType.STRING, allowNull: true })
  declare countryId: CreationOptional<string | null>;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: CreationOptional<string | null>;

  // @HasMany(() => Post)
  // declare posts: NonAttribute<Post[]>;

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
