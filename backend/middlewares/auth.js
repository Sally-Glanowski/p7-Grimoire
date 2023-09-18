module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[];
      const { userId } = Token;

      req.auth = {
        userId,
      };
      next();

    } catch (error) {
      res.status(401).json({ error });
    }
  };