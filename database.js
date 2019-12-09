let mongoose = require('mongoose');
let constants = require("./constants");

const cstring = constants.dburl;
class Database {
  constructor() {
    this._connect()
  }
  
_connect() {
     mongoose.connect(`${cstring}`,{useNewUrlParser: true})
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()