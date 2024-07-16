const jwt = require('jsonwebtoken');
const semver = require('semver');

const config = require('../config');
const db = require('../config/pgsql');
const response = require('./response');

class HeaderValidator {

  validateHeaders(headers) {
    let error;

    if (!headers.language) {
      error = {
        param: "language",
        type: "required",
      };
    } 
    else if (!headers.auth_token) {
      error = {
        param: "auth_token",
        type: "required",
      };
    }
    /* else if (!headers.web_app_version) {
       } */
    else if (!headers.device_id) {
      error = {
        param: "device_id",
        type: "required",
      };                   
    } 
    else if (!headers.device_type ){
      error = {
        param: "device_type",
        type: "required",
      }; //'0' for IOS ,'1' for android
    } 
    else if (!headers.app_version) {
      error = {
        param: "app_version missing!",
        type: "required",
      };
    } 
    else if (!headers.os) {
      error = {
        param: "os",
        type: "required",
      };
    } 
    else if (!headers.device_token) {
      error = {
        param: "device_token",
        type: "required",
      };
    } 
    else {
      let version = headers.app_version,
        currentAppVersion = config.appVersion,
        tmp_version = version.split(".");

      tmp_version =
        tmp_version.length < 3
          ? tmp_version.concat(["0", "0", "0"])
          : tmp_version;
      tmp_version.splice(3);
      version = tmp_version.join(".");

      if (semver.valid(version) === null) {
        error = "INVALID_APP_VERSION";
      } else {
        if (semver.satisfies(version, `>= ${currentAppVersion}`)) {
        } else {
          error = "UPGRADE_APP";
        }
      }
    }
    return error;
  }

  nonAuthValidation(req, res, next) {
    let error = module.exports.validateHeaders(req.headers);

    if (error) {
      response.error(res, error, req.headers.language);
    } else if (req.headers.auth_token !== config.defaultAuthToken) {
      response.error(res, 'INVALID_TOKEN', req.headers.language);
    } else {
      console.log(`nonAuthValidation req.body ->> `, req.body);
      next();
    }
  }

  authValidation(req, res, next) {
        
    // console.log("\nTOKEN--->>>>>", req.headers.auth_token);
    let error = module.exports.validateHeaders(req.headers);
    // console.log("\nereor in --->>>", error);

    if (error) {
      response.error(res, "INVALID_REQUEST_HEADERS", req.headers.language);
    } else {
      jwt.verify(req.headers.auth_token,config.jwtSecretKey,(error, decoded) => {
          console.log(`\n AuthValidation error first--------///->> ${error} decoded ->> ${JSON.stringify(decoded)}`);

          if (error) {
            if (error.name === "TokenExpiredError" && req.skip) {
              let decoded = jwt.decode(req.headers.auth_token);

              console.log(
                `\nAuthValidation decoded ->> ${decoded} token ->> ${req.headers.auth_token}`
              );
              req.body.user_id = decoded.user_id;

              module.exports.isUserActive(req, res, next);
              next();
            } else {
              if (req.route.path === "/refreshToken") {
                next();
              } else {
                response.error(res, "TOKEN_EXPIRED", req.headers.language);
              }
            }
          } else if (decoded && decoded.user_id) {
            req.body.user_id = decoded.user_id;
            next();
          } else {
            console.log(`auth validator user_id -->>${decoded.user_id}`);

            response.error(res, "TOKEN_MALFORMED", req.headers.language);
          }
        }
      );
    }
  }

  authAdminValidation(req, res, next) {
    let error = module.exports.validateAdminHeaders(req.headers);
    console.log('\n error ----',`${error}`,req.skip);
    if (error) {  
      response.error(res, 'INVALID_REQUEST_HEADERS', req.headers.language);
    } else {
      jwt.verify(req.headers.auth_token, config.jwtSecretKey, (error, decoded) => {
        console.log(`\n AuthValidation error ->> ${error} decoded ->> ${JSON.stringify(decoded)}`);
        console.log('\n req.skip --',req.skip);
        if (error) {
          if (error.name === 'TokenExpiredError' && req.skip) {
            let decoded = jwt.decode(token);

            console.log(`\nAuthValidation decoded ->> ${decoded} token ->> ${token}`);
            req.body.user_id = decoded.user_id;
            // req.body.user_type = decoded.user_type;
            // req.body.is_admin = decoded.is_admin;

            next();
          } else {
            if (req.route.path === '/refreshToken') {
              next();
            } else {
              response.error(res, 'TOKEN_EXPIRED', req.headers.language);
            }
          }
        } else if (decoded && decoded.user_id) {
          req.body.user_id = decoded.user_id;
          next();
        } else {
          console.log(` auth AdminValidation user_id -->>${decoded.user_id}`);

          response.error(res, 'TOKEN_MALFORMED', req.headers.language);
        }
      });
    }
  }

  validateAdminHeaders(headers) {
    let error;
    if (!headers.auth_token) {
      error = {
        param: 'auth_token',
        type: 'required'
      };
    }

    return error;
  }

  nonAuthAdminValidation(req, res, next) {
    let default_token = config.defaultAuthToken;

    let error = module.exports.validateAdminHeaders(req.headers);
    console.log(`\n NonAuthAdminValidation error ->> ${error}`);

    if (error) {
      response.error(res, error, req.headers.language);
    } else if (req.headers.auth_token) {
      if (default_token != req.headers.auth_token) {
        response.error(res, 'INVALID_TOKEN', req.headers.language);
      } else {
        console.log(`\n NonAuthAdminValidation next ->>`);
        next();
      }
    }
  }

  adminValidation(req, res, next) {
    let error = module.exports.validateAdminHeaders(req.headers);
    console.log(`\nAdminValidation error ->> ${error}`);

    if (error) {
      response.error(res, error, req.headers.language);
    } else {
      if (!req.headers.auth_token) {
        // response.error(res, 'LOGIN_FIRST', req.headers.language)
        response.error(res, 'SOMETHING_WENT_WRONG', req.headers.language);
      } else if (req.skip) {
        next();
      } else {
        let token = req.headers.auth_token;

        jwt.verify(token, config.jwtSecretKey, async function (error, decoded) {
          if (error) {
            console.log(`\nAdminValidation jwt.verify error ->> ${error}`);

            response.error(res, 'TOKEN_EXPIRED', req.headers.language);
          } else {
            console.log(`\nAdminValidation decoded ->> ${decoded}`);

            if (decoded && decoded.user_id) {
              req.user_id = decoded.user_id;
              next();
            } else if (decoded && decoded.device_token) {
              req.device_token = decoded.device_token;
              next();
            } else {
              console.log(`\nAdminValidation decode not found or undefined ->>`);
              response.error(res, 'TOKEN_MALFORMED', req.headers.language);
              next()
            }
          }
        });
      }
    }
  }

}

module.exports = new HeaderValidator();