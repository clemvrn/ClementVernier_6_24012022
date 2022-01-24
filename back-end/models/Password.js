//Permet de vérifier le mot de passe d'un user afin de garantir un mot de passe fort
const passwordValidator = require('password-validator');

// Create a schema
const passwordSchema = new passwordValidator();

// Add properties to it
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces              

module.exports = passwordSchema;