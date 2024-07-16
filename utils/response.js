const messages = require('./messages.json');

class Response {
  async  error(res, msg, language, statusCode = 400) {
    let response = {
      code: 0,
      status: 'FAIL',
      message: this.getMessage(msg, language) ? this.getMessage(msg, language) : msg
    }
    
    if (msg.message == '\"mobileNumber\" must be greater than or equal to 1000000000')
      statusCode = 401;

    if (msg == 'USER_BLOCKED')
      statusCode = 403;

    if (msg == 'TOKEN_EXPIRED')
      statusCode = 401;

    if (msg === 'UPGRADE_APP')
      statusCode = 403;
    res.status(statusCode).json(response);
  }

  async success(res, msg, language, data, statusCode = 200) {
    let response = {
      code: 1,
      status: 'SUCCESS',
      message: this.getMessage(msg, language),
      data: data ? data : {}
    }
    res.status(statusCode).json(response);
  }

  getMessage(msg, language) {
    let lang = language ? language : 'en' ;

    if (msg.param && msg.param.includes('email')) {
      msg.param = 'email'
    }

    if (msg.type && msg.type.includes('and')) {
      return msg.message
    }

    if (msg.param && msg.type) {
      if (msg.type.includes('required')) {
        return messages[lang]['PARAMETERS_REQUIRED'].replace('@Parameter@', msg.param)
      } else if (msg.type.includes('min')) {
        return msg.message
      } else {
        return messages[lang]['INVALID_REQUEST_DATA'].replace('@Parameter@', msg.param)
      }
    } else if (msg.toString().includes('ReferenceError:')) {
      return messages[lang]['INTERNAL_SERVER_ERROR'];
    } else {
      return messages[lang][msg] || messages[lang]['SOMETHING_WENT_WRONG'];
    }
  }
}

module.exports = new Response()