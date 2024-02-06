// import jwt from "jsonwebtoken"
const jwt = require('jsonwebtoken');
// const secretKey = 'your-secret-key'// Replace with your own secret key

const generateToken = (payload) => {
  // Sign the payload with the secret key and set an expiration time (e.g., 1 hour)
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '6h',
  });

  return token;
};

export { generateToken };
