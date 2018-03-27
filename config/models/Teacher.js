const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  const {
    STRING,
    DATE,
    DATEONLY,
    NOW,
    SMALLINT,
    BOOLEAN
  } = DataTypes;

  const Teacher = sequelize.define('teacher', {
    id: {
      type: SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: STRING(150),
      allowNull: false,
    },
    last_name: {
      type: STRING(150),
      allowNull: false,
    },
    email: {
      type: STRING(150),
      allowNull: false,
    },
    password: STRING,
    gender: BOOLEAN,
    birthday: DATEONLY,
    address: STRING(200),
    created_on: {
      type: DATE,
      defaultValue: NOW,
    }
  }, {
    freezeTableName: true,
    paranoid: true,
    timestamps: false,
    underscored: true
  })

// Instance method for hasing saved passwords
Teacher.prototype.hash = function(cb) {
  console.log(this.password);
  bcrypt.genSalt(12, (err, salt) => {
    bcrypt.hash(this.password, salt, null, (err, result) => {
      if (err) cb(null, err);
      cb(result, null);
    });
  });
};

// Instance method for comparing password
Teacher.prototype.compare = function(password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    if (err) cb(null, err);
    cb(result, null);
  });
};
  return Teacher;
};
