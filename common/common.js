const jwt = require("jsonwebtoken");
const dataCodes = require("./dataCodes");
const config = require("../config");

class Common {
  parseJSON(data) {
    if (typeof data == "object") {
      return data;
    }

    try {
      return JSON.parse(data);
    } catch (err) {
      return {};
    }
  }

  getFinalData(event, data, statusCode) {
    if (!statusCode) statusCode = "200";

    statusCode = statusCode.toString();

    if (!data) data = {};

    var statusCodeDetails = dataCodes[statusCode]
      ? dataCodes[statusCode]
      : dataCodes["200"];

    var finalData = {
      code: statusCode,
      error: statusCodeDetails.IsError,
      message: statusCodeDetails.Message,
      event: event,
      data: data,
    };

    return finalData;
  }

  getJwtToken(user_id) {
    // user_type - 1 - passenger user, 2 - driver user
    return new Promise((resolve, reject) => {
      try {
        let expirationTime = user_id
            ? config.jwtExpiryAdminTime
            : config.jwtExpiryUserTime,
          sign = {
            user_id,
            // user_type,
            // is_admin
          };

        let token = jwt.sign(sign, config.jwtSecretKey, {
          expiresIn: expirationTime,
        });
        return resolve(token);
      } catch (error) {
        return reject(error);
      }
    });
  }

  generateOTP(n) {
    let digits = "0123456789";
    let otp = "";

    for (let i = 0; i < n; i++) {
      let index = Math.floor(Math.random() * digits.length);

      if (i == 0 && !parseInt(digits[index])) i--;
      else otp += digits[index];
    }

    return otp;
  }

}

module.exports = new Common();
