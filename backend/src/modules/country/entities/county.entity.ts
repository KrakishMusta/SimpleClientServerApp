import { Table, Column, Model, DataType } from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

@Table({
  tableName: 'country',
  timestamps: false,
  paranoid: false,
})
export class Country extends Model<
  InferAttributes<Country>,
  InferCreationAttributes<Country>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare eNname: string;
  @Column({
    type: DataType.STRING(2),
    allowNull: false,
    unique: true,
  })
  declare code: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
  })
  declare countryCode: number;
}
