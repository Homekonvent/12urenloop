const express = require('express');
let app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const socketIO = require('socket.io');
const sqlite3 = require('sqlite3');
const http = require('http');

let server = http.createServer(app);
let io = socketIO(server);
let aaSqlite = require("./db_as");
dotenv.config();
let port = 4600;

let runRouter = require('./routes/runs');
let userRouter = require('./routes/user');
const {v4: uuidv4} = require("uuid");

server.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});

io.on('connection', async function (socket) {
    console.log('a user has connected!');
    let db_url = process.env.DB_URL || "data.db";
    try {

        let db = await aaSqlite.open(db_url);

        let runners = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, run.inserted from run join runners on run.user_id=runners.id where run.has_run=0 order by "inserted" asc limit 10;`);
        socket.emit('update-runners', runners);
        let speed = await aaSqlite.all(db,`select (runners.first_naam || " " || runners.last_name) as name, (run.stopped - run.started ) as duration from run join runners on run.user_id=runners.id where run.has_run=1 and duration != 0  and duration > 0 order by duration asc limit 5;`,[])
        socket.emit('update-speed', speed);
        let most = await aaSqlite.all(db, `select home, count(*) as rounds from run where run.has_run=1 group by home order by rounds desc limit 5;`,[]);
        socket.emit('update-most', most);

        await aaSqlite.close(db);


    } catch (err) {
        console.log(err);
    }
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

app.use((req, res, next) => {
    req.io = io;
    return next();
});


app.set("view engine", "ejs");
// Set up Global configuration access
dotenv.config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

app.use(function (req, res, next) {
    if (req.url.startsWith("css")) {
        req.url = "static/" + req.url;
    }
    if (req.url.startsWith("fonts")) {
        req.url = "static/" + req.url;
    }
    if (req.url.startsWith("images")) {
        req.url = "static/" + req.url;
    }
    if (req.url.startsWith("js")) {
        req.url = "static/" + req.url;
    }
    next();
});

let db_url = process.env.DB_URL || "data.db";


const createTables = (newdb) =>
    newdb.exec(`
    CREATE TABLE "runners" (
  "id" varchar PRIMARY KEY,
  "first_naam" varchar,
  "last_name" varchar,
  "home" varchar,
  "email" varchar,
  "verified_supporter" int
);

CREATE TABLE "home" (
  "home" int,
  "schild" varchar,
  "order_number" int
);

CREATE TABLE "run" (
  "user_id" varchar PRIMARY KEY,
  "inserted" float,
  "started" timestamp,
  "has_run" boolean,
  "stopped" timestamp,
  "home" varchar
);
    COMMIT;
`, () => {
    });


function createDatabase() {
    let newdb = new sqlite3.Database(db_url, (err) => {
        if (err) {
            console.error("Getting error " + err);
        }
        createTables(newdb);
    });
    newdb.close();
}

const startDB = () => new sqlite3.Database(db_url, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code === "SQLITE_CANTOPEN") {
        createDatabase();
    } else if (err) {
        console.error("Getting error " + err);
    }
});

app.use('/run', runRouter);
app.use('/user', userRouter);

app.get("/", function (req, res) {
    res.render("index", {});
});

app.get("/wachtrij", function (req, res) {
    res.render("wachtrij", {});
});

app.get("/admin", function (req, res) {
    res.render("loper", {});
});

app.get("/admin/new", function (req, res) {
    res.render("newuser", {});
});

app.get("/admin/run", async function (req, res) {
    let db_url = process.env.DB_URL || "data.db";

    let db = await aaSqlite.open(db_url);

    let runners = await aaSqlite.all(db, `select id, ( first_naam || " " || last_name ) as name from runners;`);

    await aaSqlite.close(db);
    res.render("addrun", {runners:runners});
});

startDB()

module.exports = app;
