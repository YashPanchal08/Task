require('dotenv').config()
require("express-group-routes");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const initPgsql = require("./config/pgsql");
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;

require("./app/v1/routes/admin").routerConfig(app);

Promise.all([require("./config/httpServer")()])
  .then((values) => {
    server.listen(app.get("port"), () => {
      console.log(
        `----------------------- Server listening on the port ${app.get(
          "port"
        )} ${new Date()} -----------------------`
      );

      initPgsql.getDBConnect().then(() => {
        console.log(`Pgsql Connected`);
      });
    });
  })
  .catch((error) => {
    console.log(
      `----------------------- Main server configuration error >> ${error} \n---------------------------------------------- `
    );
  });
