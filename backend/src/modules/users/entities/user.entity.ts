import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
    BeforeCreate,
    BeforeUpdate,
    BeforeBulkCreate,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { Post } from '../../posts/entities/post.entity';

@Table({
    tableName: 'users',
    timestamps: true,
    paranoid: true, // мягкое удаление
})
export class User extends Model<User> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true,
        },
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
    declare role: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: 'is_email_verified',
    })
    isEmailVerified: boolean;

    @Column({
        type: DataType.DATE,
        field: 'last_login_at',
    })
    declare lastLoginAt: Date;

    @HasMany(() => Post)
    declare posts: Post[];

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

    // Виртуальные поля (не сохраняются в БД)
    @Column({
        type: DataType.VIRTUAL,
        get(this: User) {
            return `${this.username} (${this.email})`;
        },
    })
    declare displayName: string;
}
