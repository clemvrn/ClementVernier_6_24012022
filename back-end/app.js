const express = require('express');
const bodyParser = require('body-parser');
//Facilite les interactions entre l'application Express et la base de données MongoDB
const mongoose = require('mongoose');
//
const path = require('path');
//Package helmet : permet de sécuriser davantage les en-têtes HTTP renvoyés par l'application express
const helmet = require('helmet');
//Package dotenv : permet de masquer les données sensibles
require('dotenv').config();

//Routeur
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Création d'une application Express
const app = express();

app.use(helmet());

//Utilisation d'une variable d'environnement grâce au package dotenv
mongoose.connect(process.env.DB_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//req = object requete / res = object reponse
//avec next on passe d'un middleware à un autre
app.use((req, res, next) => {
    //Accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Envoyer des requêtes avec les méthodes mentionnées
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

//Permet d'attribuer un middleware à une route spécifique de votre application.
//Indique à Express comment gérer la ressource images de manière statique à chaque requête
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

//Exportation de l'application pour pouvoir y accéder dans d'autres fichiers
module.exports = app;