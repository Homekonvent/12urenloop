const express = require('express');
const router = express.Router();
const aaSqlite = require("../db_as");

const decodingJWT = (token) => {
    if (token !== null || token) {
        const base64String = token.split(".")[1];
        return JSON.parse(Buffer.from(base64String, "base64").toString("ascii"));
    }
    return null;
}

router.get("/callback", async (req, res, next) => {
    fetch('https://letmein.homekonvent.be/user/validate', {
        method: 'GET',

        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            cookie: 'JWT='+req.cookies.JWT,
        },
    }).then((response) => response.json())
        .then(async (response) => {
            if (response.valid) {
                let db_url = process.env.DB_URL || "data.db";
                try {
                    let decoded = decodingJWT(req.cookies.JWT);
                    let name = decoded.name;
                    let mail = decoded.userId;
                    let home = decoded.home;

                    let db = await aaSqlite.open(db_url);

                    await aaSqlite.push(db, `insert into runners ("id" ,"first_naam","last_name","home","email","verified") values (?,?,?,?,?,0);COMMIT;`, [uuidv4(), " "," ",home,mail,home]);

                    await aaSqlite.close(db);

                    res.send({success: true});
                } catch (err) {
                    res.status(500).send({success: false, err: err});
                    next(err);
                }
            }
        });
});


module.exports = router;
