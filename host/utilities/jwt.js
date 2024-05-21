import jwt from "jsonwebtoken";
import createError from "http-errors";

function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.SECRETKEY;
    const options = {
      expiresIn: "12h",
      issuer: "localhost:9999",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        reject(err);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(createError.Unauthorized());

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.SECRETKEY, (err, payload) => {
    if (err) return next(createError.Unauthorized());
    req.payload = payload;
    next();
  });
}

export { signAccessToken, verifyAccessToken };
