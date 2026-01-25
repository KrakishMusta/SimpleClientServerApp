import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { IActivityRecord } from '../interfaces/event.interface';
import { Area } from 'src/modules/area/entities/area.entity';
import { City } from 'src/modules/city/entities/city.entity';

@Table({
  tableName: 'event',
  timestamps: true,
  paranoid: true,
})
export class EventModel extends Model<
  InferAttributes<EventModel>,
  InferCreationAttributes<EventModel>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({ type: DataType.STRING, allowNull: false })
  declare title: string;

  // AREA FK
  @ForeignKey(() => Area)
  @Column({ type: DataType.UUID, allowNull: false })
  declare areaId: string;

  @BelongsTo(() => Area)
  declare area?: Area;

  @Column({ type: DataType.DATE, allowNull: false })
  declare startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare endDate: Date;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare durationDays: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare durationMins: number;

  // CITY FK
  @ForeignKey(() => City)
  @Column({ type: DataType.UUID, allowNull: false })
  declare cityId: string;

  @BelongsTo(() => City)
  declare city?: City;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    defaultValue: [],
  })
  declare activities: IActivityRecord[] | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  declare winner: string | null;
}
