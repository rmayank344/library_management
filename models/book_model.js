const { DataTypes } = require('sequelize');
const sequelize = require("../DB/sql_conn");

const BookModel = sequelize.define("book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    timestamps: true, // This will add automatically created_at and updated_at
    freezeTableName: true,
    tableName: "book",
  }
);

// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = BookModel;