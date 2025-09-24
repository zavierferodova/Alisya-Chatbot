import sequelize from '.';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

class State extends Model<InferAttributes<State>, InferCreationAttributes<State>> {
  declare id: CreationOptional<string>;
  declare takeover: boolean;
  declare publicFunction: boolean;
  declare updatedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

State.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    takeover: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    publicFunction: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'State',
  },
);

export default State;
