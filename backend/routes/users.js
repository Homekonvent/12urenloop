var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const crypt = require('sha512crypt-node');
var sqlite3 = require('sqlite3');

/* GET users listing. */
router.get('/', function(req, res, next) {
    let hash = crypt.sha512crypt("pass","saltsalt");
  res.send(hash);
});

router.post("/generateToken", (req, res) => {
  // Validate User Here
  // Then generate JWT Token

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: 12,
  }

  const token = jwt.sign(data, jwtSecretKey);

  res.send(token);
});

router.get("/user/validateToken", (req, res) => {
  // Tokens are generally passed in the header of the request
  // Due to security reasons.

  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = req.header(tokenHeaderKey);

    const verified = jwt.verify(token, jwtSecretKey);
    if(verified){
      return res.send("Successfully Verified");
    }else{
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
});

module.exports = router;
