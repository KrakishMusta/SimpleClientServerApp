import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';

import { EventModel } from 'src/modules/event/event/entities/event.entity';
import { ActivityJury } from './activity-jury.entity';

@Table({
  tableName: 'activities',
  timestamps: true,
  paranoid: true,
})
export class Activity extends Model<
  InferAttributes<Activity>,
  InferCreationAttributes<Activity>
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare start: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare dayIndex: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare date: Date;

  // JURY ASSIGNMENTS
  @HasMany(() => ActivityJury)
  declare jury?: NonAttribute<ActivityJury[]>;
}
