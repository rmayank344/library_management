const { DataTypes } = require('sequelize');
const sequelize = require('../DB/sql_conn');
const User = require('./user_model');
const Book = require('./book_model');



const TransactionModel = sequelize.define("transactions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Table name (not model name)
        key: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Book,
        key: "id",
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM("borrowed", "returned"),
      defaultValue: "borrowed",
    },
  },
  {
    timestamps: true, // This will add automatically created_at and updated_at
    freezeTableName: true,
    tableName: "transactions",
  }
);


// sequelize.sync({ force: false }) // Uncomment this if you want to sync the model with the database
//   .then(() => {
//     console.log('Database & tables created!');
// });

module.exports = TransactionModel;