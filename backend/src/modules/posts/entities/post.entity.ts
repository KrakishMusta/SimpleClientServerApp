import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table({
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
})
export class Post extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    content: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        field: 'is_published',
    })
    isPublished: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    views: number;
}
