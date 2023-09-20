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
  .spaces();

module.exports = (req, res, next) => {
  const userPassword = req.body.password;
  if (!passwordSchema.validate(userPassword)) {
    console.error(
      "Erreur de validation du mot de passe:",
      passwordSchema.validate(userPassword, { list: true })
    );
    return res.status(400).json({
      error: `Mot de passe insiffusant ${passwordSchema.validate(userPassword, {
        list: true,
      })}`,
    });
  } else {
    next();
  }
};