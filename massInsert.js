const sequelize = require('./config/db/sequelize');
const crypto = require('crypto');
const http = require('https');
const querystring = require('querystring');
const fs = require('fs');
const uuidv5 = require('uuidv5');

const generateRandomSeed = (length) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) reject(new Error(err));
      resolve(buffer.toString('hex'));
    });
  });
};

function generateUUIDv5(name) {
  let privns = uuidv5('null', name, true);
  return uuidv5(privns, 'imabanana');
};

const PersonType = {
  init: function(arr) {
    this.personTypeArr = arr;
  },

  randomize: function() {
    return this.personTypeArr[Math.floor(Math.random() * this.personTypeArr.length)];
  },
};

function getRandomPersonFromURL(url) {
  let result = '';
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      //console.log(res.headers);
      res.setEncoding('utf8');
      res.on('data', (chunk) => result += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(result));
        }
        catch (err) {
          reject(new Error(err));
        }
      }).on('error', (err) => {
        console.log(err.message);
      });
    });
  });
};

function bulkNameRetrieve() {
  return new Promise((resolve, reject) => {
    //Querystring containing queries for URL retrieval
    var query = querystring.stringify({
      nat: ['us', 'ca', 'fr'],
      page: 10,
      results: 1000,
      seed: generateRandomSeed(10)
    });
    //Get info from URL with the aforementioned querystring
    resolve(getRandomPersonFromURL(`https://randomuser.me/api/?${query}`));
  })
  .then(data => {
    let {
      results
    } = data,
    personTypeArr = ['Teacher', 'Student', 'Supervisor'];
    personArray = [],
    person = {},
    type = Object.create(PersonType)
    ;

    type.init(personTypeArr);

    if(!results) return Promise.reject(new Error("Empty response."));

    results.map(info => {
      person = ({ ...args
      } = {
        firstName: normalize(info.name.first),
        lastName: normalize(info.name.last),
        personsType: type.randomize(),
        gender: info.gender === "male" ? 1 : 0,
        address: info.location.street + ", " + info.location.city + ", " + info.location.state,
        telephone: info.phone,
        dateOfBirth: new Date(info.dob).toISOString(),
        personID: generateUUIDv5(info.id.value), //Generate UUIDv5 string for user identification
        email: info.email,
        password: info.login.password
      });

      personArray.push(person);
    })


    //Second way to do the stuff I just did above, but this time with object destructuring.
    // const {
    //     results: [{name: {first: firstName}}],
    //     results: [{name: {last: lastName}}],
    //     results: [{gender}],
    //     results: [{location: {street}}],
    //     results: [{location: {city}}],
    //     results: [{location: {state}}],
    //     results: [{phone}],
    //     results: [{dob}],
    //     results: [{id: {value: ID}}],
    //     results: [{login: {username}}],
    //     results: [{login: {password}}],
    // } = result;

    //console.log(newObject);
    //console.log(typeof(personArray));

    //Write to file
    fs.writeFileSync(__dirname + '/people.txt', JSON.stringify(personArray, null, 4), 'utf8');

    return Promise.resolve(personArray);
  })
  .catch(error => console.log(error));
};

function normalize(string) {
    let initialLetter = string.substring(0, 1);
    return initialLetter.toUpperCase() + string.substring(1, string.length);
}


function bulkInsert(data) {
  //Begin builk insert using Sequelize
  data.map(item => sequelize.query("INSERT INTO `persons` VALUES (:personID, :firstName, :lastName, :gender, :dateOfBirth, :telephone, :address, :personsType)", {
    replacements: {
      personID: item.personID,
      firstName: item.firstName,
      lastName: item.lastName,
      gender: item.gender,
      dateOfBirth: item.dateOfBirth,
      telephone: item.telephone,
      address: item.address,
      personsType: item.personsType
    }
  }));
};

bulkNameRetrieve()
.then(data => bulkInsert(data))
.catch(error => console.log("Retrieval error:", error));