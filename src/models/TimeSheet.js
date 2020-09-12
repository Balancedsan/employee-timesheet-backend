'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeSheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      TimeSheet.belongsTo(models.User, {foreignKey:"userId"})
    }
  };
  TimeSheet.init({
    timesheetId:{
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull:false
    },
    status:{
      type: DataTypes.ENUM("Check In","Check Out"),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      field: 'createdAt',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      field: 'updatedAt',
    },
    checkIn: DataTypes.DATE,
    checkOut: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'TimeSheet',
    tableName:"timesheets"

  });
  return TimeSheet;
};