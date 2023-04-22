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

router.post("/", async (req, res, next) => {
    let db_url = process.env.DB_URL || "data.db";
    try {

        let name = req.body.name;
        let icon = req.body.icon;
        let db = await aaSqlite.open(db_url);

        await aaSqlite.push(db, `insert into run ("id" ,"name","location","icon") values (?,?,"51.026999,3.7120183",?);COMMIT;`, [uuidv4(),name,icon]);

        let data = await aaSqlite.all(db,`select * from team;`, []);
        await aaSqlite.close(db);
        req.io.emit('update-event', data);

        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ success: false, err: err });
        next(err);
    }
});

router.post("/next", async (req, res, next) => {
    let db_url = process.env.DB_URL || "data.db";
    try {

        let name = req.body.name;
        let icon = req.body.icon;
        let db = await aaSqlite.open(db_url);

        await aaSqlite.push(db, `insert into run ("id" ,"name","location","icon") values (?,?,"51.026999,3.7120183",?);COMMIT;`, [uuidv4(),name,icon]);

        let data = await aaSqlite.all(db,`select * from team;`, []);
        await aaSqlite.close(db);
        req.io.emit('update-event', data);

        res.send({ success: true });
    } catch (err) {
        res.status(500).send({ success: false, err: err });
        next(err);
    }
});


module.exports = router;