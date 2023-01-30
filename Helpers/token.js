const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      (err, encoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(encoded);
      }
    );
  });


const verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(
        token,
        process.env.TOKEN_SECRET,
        (err, payload) => {
            if (err) {
            reject(err);
            return;
            }

            resolve(payload);
        }
        );
    });

module.exports = {
  generateToken,
  verifyToken,
};