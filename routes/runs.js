const express = require('express');
const router = express.Router();
const aaSqlite = require("../db_as");
const {v4: uuidv4} = require('uuid');
const fetch = require('node-fetch');

const decodingJWT = (token) => {
    if (token !== null || token) {
        const base64String = token.split(".")[1];
        return JSON.parse(Buffer.from(base64String, "base64").toString("ascii"));
    }
    return null;
}

router.post("/", async (req, res, next) => {
    /*fetch('https://letmein.homekonvent.be/user/validate', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        cookie: 'JWT='+req.cookies.JWT,
    },
}).then((response) => response.json())
    .then(async (response) => {
        if (response.valid) {*/
    let db_url = process.env.DB_URL || "data.db";
    try {
        console.log(req.body);
        let userhome = req.body.home;
        let id = req.body.id
        let db = await aaSqlite.open(db_url);
        let max = await aaSqlite.all(db, `select max(inserted) as maximum, home from run where home = ? and has_run=0;`,[userhome]);
        max = max[0];
        let homes = ["Astrid", "Boudewijn", "Bertha", "Mercator", "Savania", "Fabiola", "Vermeylen", "Confabula"]
        let index = homes.indexOf(max.home);
        let userindex = homes.indexOf(userhome);

        let neindex = 0;
        if (max.maximum ){
            neindex = max.maximum;
        }else {
            let max2 = await aaSqlite.all(db, `select min(inserted) as maximum, home from run where has_run=0;`,[]);
            if (max2[0].maximum){
                neindex = max2[0].maximum;
            }
        }
        if (userindex > index) {
            neindex += userindex +1;
        } else {
            neindex += userindex + homes.length +1;
        }

        await aaSqlite.push(db,`insert into run ("user_id","inserted","started","has_run","stopped","home") values (?,?,0,0,0,?);`,[id,neindex,userhome])

        let runners = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, run.inserted from run join runners on run.user_id=runners.id where run.has_run=0 order by "inserted" asc;`,[])
        req.io.emit('update-runners', runners);

        let speed = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, (run.stopped - run.started ) as duration from run join runners on run.user_id=runners.id where run.has_run=1 and duration != 0  and duration > 0 order by duration asc limit 5;`,[])
        req.io.emit('update-speed', speed);

        let most = await aaSqlite.all(db, `select home, count(*) as rounds from run where run.has_run=1 group by home order by rounds desc limit 5;`,[]);
        req.io.emit('update-most', most);

        await aaSqlite.close(db);

        res.send({success: true});
    } catch (err) {
        res.status(500).send({success: false, err: err});
        next(err);
    }
    /*
}else {
res.status(500).send({success: false, err: "not authenitcated"});
}
});*/
});

router.post("/next", async (req, res, next) => {
    /*fetch('https://letmein.homekonvent.be/user/validate', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        cookie: 'JWT='+req.cookies.JWT,
    },
}).then((response) => response.json())
    .then(async (response) => {
        if (response.valid) {*/
    let db_url = process.env.DB_URL || "data.db";
    try {
        let db = await aaSqlite.open(db_url);

        let lowest = await aaSqlite.all(db, `select user_id, inserted from run where has_run=0 order by inserted asc limit 2;`,[]);
        console.log(lowest);
        if (lowest[0]){
            await aaSqlite.push(db,"update run set has_run=1 , stopped = strftime('%s') where user_id = ? and inserted = ?;commit;",[lowest[0].user_id,lowest[0].inserted]);
        }
        if (lowest[1]){
            await aaSqlite.push(db,"update run set started = strftime('%s') where user_id = ? and inserted = ?;commit;",[lowest[1].user_id,lowest[1].inserted]);
        }

        let runners = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, run.inserted from run join runners on run.user_id=runners.id where run.has_run=0 order by "inserted" asc;`)
        req.io.emit('update-runners', runners);

        let speed = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, (run.stopped - run.started ) as duration from run join runners on run.user_id=runners.id where run.has_run=1 and duration != 0  and duration > 0 order by duration asc limit 5;`,[])
        req.io.emit('update-speed', speed);

        let most = await aaSqlite.all(db, `select home, count(*) as rounds from run where run.has_run=1 group by home order by rounds desc limit 5;`,[]);
        req.io.emit('update-most', most);

        await aaSqlite.close(db);

        res.send({success: true});
    } catch (err) {
        res.status(500).send({success: false, err: err});
        next(err);
    }
    /*
}else {
res.status(500).send({success: false, err: "not authenitcated"});
}
});*/
});

router.post("/skip", async (req, res, next) => {
    /*fetch('https://letmein.homekonvent.be/user/validate', {
    method: 'GET',
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
        cookie: 'JWT='+req.cookies.JWT,
    },
}).then((response) => response.json())
    .then(async (response) => {
        if (response.valid) {*/
    let db_url = process.env.DB_URL || "data.db";
    try {
        let db = await aaSqlite.open(db_url);

        let lowest = await aaSqlite.all(db, `select user_id, inserted from run where has_run=0 order by inserted asc limit 3;`,[]);

        if (lowest[0]){
            await aaSqlite.push(db,"update run set has_run=1 , stopped = strftime('%s') where user_id = ? and inserted = ?;commit;",[lowest[0].user_id,lowest[0].inserted]);
        }
        if (lowest[1]){
            await aaSqlite.push(db,"update run set has_run=1 where user_id = ? and inserted = ?;commit;",[lowest[1].user_id,lowest[1].inserted]);
        }
        if (lowest[2]){
            await aaSqlite.push(db,"update run set started = strftime('%s') where user_id = ? and inserted = ?;commit;",[lowest[2].user_id,lowest[2].inserted]);
        }

        let runners = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, run.inserted from run join runners on run.user_id=runners.id where run.has_run=0 order by "inserted" asc;`)
        req.io.emit('update-runners', runners);

        let speed = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, (run.stopped - run.started ) as duration from run join runners on run.user_id=runners.id where run.has_run=1 and duration != 0  and duration > 0 order by duration asc limit 5;`,[])
        req.io.emit('update-speed', speed);

        let most = await aaSqlite.all(db, `select home, count(*) as rounds from run where run.has_run=1 group by home order by rounds desc limit 5;`,[]);
        req.io.emit('update-most', most);

        await aaSqlite.close(db);

        res.send({success: true});
    } catch (err) {
        res.status(500).send({success: false, err: err});
        next(err);
    }
    /*
}else {
res.status(500).send({success: false, err: "not authenitcated"});
}
});*/
});

module.exports = router;
