import sequelize from '.';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model
} from 'sequelize';

class TakeOverMemory extends Model<
  InferAttributes<TakeOverMemory>,
  InferCreationAttributes<TakeOverMemory>
> {
  declare id: CreationOptional<string>;
  declare history: string;
  declare summary: string;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

TakeOverMemory.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    history: {
      type: DataTypes.JSON,
      allowNull: false
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'TakeOverMemory'
  }
);

export default TakeOverMemory;
