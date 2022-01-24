const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 
            'Le mot de passe ne doit pas contenir d\'espace et doit avoir au minimum 8 caractères, une majuscule et un nombre.' 
        });
    } else {
        next();
    }
};