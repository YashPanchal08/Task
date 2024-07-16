const joi = require('joi')
const response = require('../../../../utils/response') 

class AddProductValidator{

  async getQuestionPaper(req, res, next) {
    try {
      let schema = joi.object({
        // productId : joi.number().required()
      }).options({
          allowUnknown: true
      });
      
      let value = schema.validate(req.query);

      if (value.error) {
        let param = value.error.details[0].context.key;
        let type = value.error.details[0].type;
        let message = value.error.details[0].message;

        if ('label' in value.error.details[0].context) {
          param = value.error.details[0].context.label;
        }

        return response.error(
          res, {
          param,
          type,
          message
        },
          req.headers.language
        );
      } else next();
    } catch (error) {
      console.log(`\n get product by id validator error ->> ${error}`);
      return response.error(res, error, req.headers.language);
    }
  }

}
module.exports = new AddProductValidator()