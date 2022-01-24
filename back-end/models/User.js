const mongoose = require('mongoose');
//package de validation pour prévalider les informations avant de les enregistrer
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true }
});

//vérifier que deux utilisateurs ne puissent partager la même adresse e-mail
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);