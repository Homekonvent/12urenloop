const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypt = require('sha512crypt-node');
const sqlite3 = require('sqlite3');
const validator = require('validator');

router.post("/register", (req, res) => {
  // Validate User Here
  // Then generate JWT Token
  let db_url = process.env.DB_URL || "data.db";
  let newdb = new sqlite3.Database(db_url, (err) => {
    if (err) res.send("error has occured");
  });
  let json = req.body

  if (!validator.isEmail(json.email)){
    res.send({"error":"invalid email"})
  }
  let hash = crypt.sha512crypt(json.password,"saltsalt");
  newdb.exec("insert into users (mail,first_naam,last_name,home,admin, hash) values ('"+json.email+"','tibo','vanheule',0,0,'"+hash+"')", (r,err)  => {
    if (err) {
      res.send(err);
      return;
    }
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      userId: 1,
    }

    const token = jwt.sign(data, jwtSecretKey);

    res.send(token);
  });


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
