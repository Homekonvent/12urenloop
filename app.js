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

let runRouter = require('./routes/run');

server.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});
io.on('connection', async function (socket) {
    console.log('a user has connected!');
    let db_url = process.env.DB_URL || "data.db";
    try {

        let db = await aaSqlite.open(db_url);

        let data = await aaSqlite.all(db, `select sum(amount) as amount , name from team left join "transaction" using ("id") group by id order by amount desc;`, []);
        await aaSqlite.close(db);
        socket.emit('update-event', data);

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
  "id" INT PRIMARY KEY,
  "first_naam" varchar,
  "last_name" timestamp,
  "home" int,
  "email" varchar,
  "verified_supporter" int
);

CREATE TABLE "home" (
  "home" int,
  "schild" varchar,
  "order_number" int
);

CREATE TABLE "run" (
  "user_id" int PRIMARY KEY,
  "inserted" float,
  "started" timestamp,
  "has_run" boolean,
  "stopped" timestamp,
  "home" int
);
    COMMIT;
`, ()  => { });


function createDatabase() {
    let newdb = new sqlite3.Database(db_url, (err) => {
        if (err) {
            console.log("Getting error " + err);
        }
        createTables(newdb);
    });
    newdb.close();
}

const startDB = () => new sqlite3.Database(db_url, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code === "SQLITE_CANTOPEN") {
        createDatabase();
        return;
    } else if (err) {
        console.log("Getting error " + err);
    }
});

app.use('/run', runRouter);

app.get("/", function (req, res) {
    res.render("index", {});
});

app.get("/admin", function (req, res) {
    res.render("loper", {});
});

app.get("/admin/new", function (req, res) {
    res.render("newuser", {});
});

startDB()

module.exports = app;
