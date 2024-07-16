const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('../server');
const {
  rejects
} = require('assert');

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      let {
        SERVER_KEY,
        SERVER_CERT
      } = process.env;

      if (fs.existsSync(SERVER_KEY) && fs.existsSync(SERVER_CERT)) {
        const serverKey = fs.readFileSync(SERVER_KEY, 'utf8');
        const serverCert = fs.readFileSync(SERVER_CERT, 'utf8');

        const serverOptions = {
          key: serverKey,
          cert: serverCert,
        };

        server = https.createServer(serverOptions, app);
        return resolve();
      } else {
        server = http.createServer(app);
        return resolve();
      }
    } catch (error) {
      console.log(`\nhttpServer catch error - >>`, error)
      return reject(error)
    }
  });
}