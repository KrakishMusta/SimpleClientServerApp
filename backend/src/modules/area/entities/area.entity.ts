import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

@Table({
  tableName: 'area',
  timestamps: false,
  paranoid: false,
})
export class Area extends Model<
  InferAttributes<Area>,
  InferCreationAttributes<Area>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
}
