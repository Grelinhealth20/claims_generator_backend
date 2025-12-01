const { body,validationResult } = require('express-validator');
  
loginValidation = [
    body('username', 'Username is required').not().isEmpty(),
    body('password', 'Password is required').not().isEmpty()
    //body('password', 'Password min length is 6').isLength({ min: 6 })
 
]

checkRules = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const apprequestValidation = {
    loginValidation: loginValidation,
    checkRules:checkRules
  };
  module.exports = apprequestValidation;