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

import { User } from 'src/modules/user/entities/user.entity';
import { EventModel } from 'src/modules/event/event/entities/event.entity';
import { UserRole } from 'src/enums/enums';

@Table({
  tableName: 'event_users',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['eventId', 'userId'],
    },
  ],
})
export class EventUser extends Model<
  InferAttributes<EventUser>,
  InferCreationAttributes<EventUser>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  // EVENT
  @ForeignKey(() => EventModel)
  @Column({ type: DataType.UUID, allowNull: false })
  declare eventId: string;

  // USER
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  // ROLE IN EVENT
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  declare role: UserRole;

  // WHO INVITED
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  declare invitedBy: CreationOptional<string | null>;
}
