import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import type { InferAttributes, InferCreationAttributes } from 'sequelize';

import { User } from 'src/modules/user/entities/user.entity';
import { Activity } from './activity.entity';

@Table({
  tableName: 'activity_jury',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['activityId', 'eventUserId'],
    },
  ],
})
export class ActivityJury extends Model<
  InferAttributes<ActivityJury>,
  InferCreationAttributes<ActivityJury>
> {
  // ACTIVITY
  @ForeignKey(() => Activity)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare activityId: string;

  // USER (jury)
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare eventUserId: string;
}
