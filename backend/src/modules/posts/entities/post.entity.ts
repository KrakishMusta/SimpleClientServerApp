import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    DefaultScope,
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@DefaultScope(() => ({
    include: [
        {
            model: User,
            attributes: ['id', 'username', 'email'],
        },
    ],
}))
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
    declare id: number;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 200],
        },
    })
    declare title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare content: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number;

    @BelongsTo(() => User)
    declare user: User;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare isPublished: boolean;

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    declare views: number;

    @Column({
        type: DataType.JSON,
        allowNull: true,
    })
    declare tags: string[];
}
