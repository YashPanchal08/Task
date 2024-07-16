
const {
  Pool
} = require('pg');

let db;

class DB {
  getDBConnect() {
    return new Promise(async (resolve, reject) => {
      try {
        db = new Pool({
          user: process.env.DB_USER,
          host: process.env.DB_HOST,
          database: process.env.DB_NAME,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT
        });

        db.connect((error) => {
          if (error) {
            console.log(`\n Pgsql Error ->> ${error}`);
            throw error;
          }
          return resolve();
        });
      } catch (error) {
        console.log(`\n getDBConnect catch error ->> ${error}`);
        return reject(error);
      }
    });
  }

  select(table, selectParams, condition) {
    return new Promise((resolve, reject) => {
      let query = `SELECT ${selectParams} FROM ${table}`;
      if (condition) {
        query += ` WHERE ${condition}`;
      }

      console.log(`\n Select query ->> ${query}`);

      db.query(query, (error, results) => {
        if (error) {
          console.log(`\n Select error ->> ${error.stack}`);
          return reject("INTERNAL_SERVER_ERROR");
        } else {
          return resolve(results.rows);
        }
      });
    });
  }
  
}

module.exports = new DB();