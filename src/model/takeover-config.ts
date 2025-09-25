import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';
import sequelize from '.';

class TakeOverConfig extends Model<
  InferAttributes<TakeOverConfig>,
  InferCreationAttributes<TakeOverConfig>
> {
  declare id: CreationOptional<string>;
  declare ownerName: string | null;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

TakeOverConfig.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    ownerName: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    modelName: 'TakeOverConfig'
  }
);

export default TakeOverConfig;
