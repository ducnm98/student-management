const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const { STRING, SMALLINT, DATE, DATEONLY, NOW } = DataTypes;
  // Model definition
  const Student = sequelize.define(
    "student",
    {
      id: {
        type: SMALLINT,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: STRING(100),
      last_name: STRING(100),
      email: {
        type: STRING(150),
        allowNull: false
      },
      password: STRING,
      gender: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }, // Man is true, Woman is False
      birthday: DATEONLY,
      faculty: STRING(20),
      address: STRING,
      phone_number: STRING(14),
      created_on: {
        type: DATE,
        defaultValue: NOW
      }
    },
    {
      // Options for model definition
      freezeTableName: true,
      paranoid: true,
      timestamps: false,
      underscored: true
    }
  );

  // Instance method for hasing saved passwords
  Student.prototype.hash = function() {
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(this.password, salt, null, (err, result) => {
        return (this.password = result);
      });
    });
  };

  // Instance method for comparing password
  Student.prototype.compare = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
      if (err) cb(null, err);
      cb(result, null);
    });
  };

  // Instance method for printing out values
  Student.prototype.sayStuff = function() {
    console.log(this.first_name);
  };
  return Student;
};
