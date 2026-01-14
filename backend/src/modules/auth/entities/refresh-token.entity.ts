import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.entity';

@Table({
  tableName: 'refresh_tokens',
  timestamps: true,
})
export class RefreshToken extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  declare token: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expiresAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  declare isRevoked: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare revokedAt: Date | null;
}
