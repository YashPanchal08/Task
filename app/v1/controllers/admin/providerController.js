const generateQuestionPaperService = require("../../services/admin/providerService");
const response = require("../../../../utils/response");
const statusCode = require("../../../../utils/statusCode");

class providerController {

  async loginAdmin(req, res) {
    try {
      let data = await loginService.loginUser(req.body);
      response.success(
        res,
        "OTP_SENT_PHONE",
        req.headers.language,
        data,
        statusCode.success
      );
    } catch (error) {
      console.log(`login admin controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, req.headers.language, statusCode.error);
    }
  }

  async otpVerify(req, res) {
    try {
      let data = await loginService.otpVerify(req.body, req.headers);
      response.success(
        res,
        "OTP_VERIFIED",
        req.headers.language,
        data,
        statusCode.success
      );
    } catch (error) {
      console.log(`otpVerify controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, req.headers.language, statusCode.error);
    }
  }

  async getQuestionPaper(req, res) {
    try {
      let data = await generateQuestionPaperService.getQuestionPaper(req.body);
      response.success(
        res,
        "SUCCESS",
        req.headers.language,
        data,
        statusCode.success
      );
    } catch (error) {
      console.log(`get question paper controller catch error ->> ${error}`);

      if (error.message)
        response.error(
          res,
          error.message,
          req.headers.language,
          error.statusCode ? error.statusCode : 403
        );
      else response.error(res, error, req.headers.language, statusCode.error);
    }
  }
  

}

module.exports = new providerController();