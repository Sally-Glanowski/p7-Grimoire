const passwordValidator = require("password-validator");

// Créé le schéma de validation du mot de passe ici
const passwordSchema = new passwordValidator();

// Ajoute les règles de validation du mot de passe
passwordSchema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

module.exports = (req, res, next) => {
  const userPassword = req.body.password;
  if (!passwordSchema.validate(userPassword)) {
    console.error(
      "Erreur de validation du mot de passe:",
      passwordSchema.validate(userPassword, { list: true })
    );
    return res.status(400).json({
      error: `Mot de passe insuffisant ${passwordSchema.validate(userPassword, {
        list: true,
      })}`,
    });
  } else {
    next();
  }
};
