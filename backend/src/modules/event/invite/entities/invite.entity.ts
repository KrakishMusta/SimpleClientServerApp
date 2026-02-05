import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { EventModel } from '../../event/entities/event.entity';
import { InviteRole } from '../interfaces/invite.interface';
import { UserRole } from 'src/enums/enums';
// import { User } from 'src/modules/user/entities/user.entity';

@Table({
  tableName: 'invites',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['code'],
    },
    {
      fields: ['eventId'],
    },
  ],
})
export class Invite extends Model<
  InferAttributes<Invite>,
  InferCreationAttributes<Invite>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // EVENT
  @ForeignKey(() => EventModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare eventId: string;

  // ROLE TO ASSIGN
  @Column({
    type: DataType.ENUM(
      UserRole.JURY,
      UserRole.MODERATOR,
      UserRole.PARTICIPANT,
    ),
    allowNull: false,
  })
  declare role: InviteRole;

  // AREA FILTER (optional)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare areaId: CreationOptional<string | null>;

  // HUMAN-READABLE CODE
  @Column({
    type: DataType.STRING(8),
    allowNull: false,
  })
  declare code: string;

  // EXPIRATION
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare expiresAt: CreationOptional<Date | null>;

  // MAX USES (null = unlimited)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare maxUses: CreationOptional<number | null>;

  // CURRENT USES
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare usesCount: CreationOptional<number>;
}
