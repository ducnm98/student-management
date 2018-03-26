const Sequelize = require("sequelize");
const sequelize = require("../db/sequelize");

const db = {
  Student: sequelize.import("../models/Student")
};

//Build object for later usage
const example = db.Student.build({
  first_name: "John",
  last_name: "Doe",
  email: "johndoe@generic.com",
  password: "123",
  gender: "Male",
  birthday: "1979-01-01",
  faculty: "IT",
  address: "123 Palm St. CA",
  phone_number: "0123456789"
});

//Asynchronous instance method to hash the password
//example.hash();

//Uncomment to save into the database
//example.save();

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
