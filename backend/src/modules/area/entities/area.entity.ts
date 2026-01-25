import {
  Table,
  Column,
  Model,
  DataType,
  Unique,
  Default,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

@Table({
  tableName: 'area',
  timestamps: false,
  paranoid: false,
})
export class Area extends Model<
  InferAttributes<Area>,
  InferCreationAttributes<Area>
> {
  @Default(uuidv4) // генерируем UUID по умолчанию
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;
}
