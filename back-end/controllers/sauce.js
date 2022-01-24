//package donnant accès aux fonctions pour modifier le système de fichiers
const fs = require('fs');
//Importation du schéma de Sauce
const Sauce = require('../models/sauce');

/* OBTENIR TOUTES LES SAUCES */
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

/* CREER UNE SAUCE */
exports.createSauce = (req, res, next) => {
  //JSON.parse transforme un objet stringifié en Object JavaScript exploitable
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  //On utilise le schéma pour créer une Sauce
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

/* OBTENIR UNE SAUCE */
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

/* MODIFIER UNE SAUCE */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

/* SUPPRIMER UNE SAUCE */
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

/* LIKER OU DISLIKER UNE SAUCE */
exports.likeDislikeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  //$inc : incrémente un champ avec une valeur spécifiée
  //$push : ajouter une valeur spécifique à un tableau
  //$pull : supprime une valeur spécifique d'un tableau

  /* LIKE */
  if (like == 1) {
    Sauce.updateOne({ _id: sauceId }, { $inc: { likes: +1 }, $push: { usersLiked: userId }})
      .then(() => res.status(200).json({ message: 'Like !'}))
      .catch(error => res.status(400).json({ error }));
  }

  /* NEUTRE */
  else if (like == 0) {
    Sauce.findOne({ _id: sauceId })
    .then((sauce) => {
      if (sauce.usersLiked.includes(userId)) { 
        Sauce.updateOne({ _id: sauceId }, { $inc: { likes: -1 }, $pull: { usersLiked: userId }})
          .then(() => res.status(200).json({ message: 'Neutre !'}))
          .catch((error) => res.status(400).json({ error }))
      }
      if (sauce.usersDisliked.includes(userId)) { 
        Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId }})
          .then(() => res.status(200).json({ message: 'Neutre !'}))
          .catch((error) => res.status(400).json({ error }))
      }
    })
    .catch((error) => res.status(404).json({ error }));
  }

  /* DISLIKE */
  else if (like == -1) {
    Sauce.updateOne({ _id: sauceId }, { $inc: { dislikes: +1 }, $push: { usersDisliked: userId }})
    .then(() => res.status(200).json({ message: 'Dislike !'}))
    .catch(error => res.status(400).json({ error }));
  }
}
