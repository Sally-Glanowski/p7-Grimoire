const passwordSchema = new passwordValidateur();
passwordSchema
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowecase()
  .has()
  .digits()
  .has()
  .not()
module.exports = (req, res, next) => {
  const userPassword = req.body.password;
  if (!passwordSchema.validate(userPassword)) {
    console.log(
      "Erreur de validation du mot de passe:",
      passwordSchema.validate(userPassword, { list: true })
    );
    return res.status(400).json({
      error: `Mot de passe insuffisant ${passwordSchema.validate(userPassword, )}`,
    });
  } else {
    next();
  }
};