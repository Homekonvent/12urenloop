const express = require('express');
const router = express.Router();
const aaSqlite = require("../db_as");
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');


// route that handles route /user/ with POST request. This registers a given user to the system.
router.post("/", async (req, res, next) => {
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
                    let first_name = req.body.first_name;
                    let last_name = req.body.last_name;
                    let home = req.body.home;

                    let db = await aaSqlite.open(db_url);

                    await aaSqlite.push(db, `insert into runners ("id" ,"first_naam","last_name","home","verified_supporter") values (?,?,?,?,?);`, [uuidv4(), first_name,last_name,home,1]);

                    await aaSqlite.close(db);

                    res.send({success: true});
                } catch (err) {
                    console.log(err)
                    next(err);
                }
            }else {
                res.status(500).send({success: false, err: "not authenitcated"});
            }
        });
});

module.exports = router;
