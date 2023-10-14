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

server.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});

// Function to define what should happen when a new clients connects.
// now it is used to immedieatly update the clinet with the data from the database.
// otherwise the client has to wait until a update to the data occurs.  next runner, runner skipped, new runner ...
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
    // define what to do if client discconected, meant for debug only
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

// Middelware
// so io from socket.io is available in every request in every route handler.
// IO is used to emit event and data over the websocket
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

// Middelware to reroute given urls to the static folder.
// quick and dirty way to not define multiple static folders in express.
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

// path to datbase location. either use the location ddefined in the config or use the default location.
let db_url = process.env.DB_URL || "data.db";


// Function that  creates all necessary tables
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

// function to create a db using a script, ONLY NO CONNECTION COULD BE ESTHASBLISHED TO AN EXISTING DATABASE.
function createDatabase() {
    let newdb = new sqlite3.Database(db_url, (err) => {
        if (err) {
            console.error("Getting error " + err);
        }
        createTables(newdb);
    });
    newdb.close();
}

// opens connection to the sqlite db, if it does not succeed then call CreatDatabase
const startDB = () => new sqlite3.Database(db_url, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code === "SQLITE_CANTOPEN") {
        createDatabase();
    } else if (err) {
        console.error("Getting error " + err);
    }
});

// add all routes from routes/runs.js, mostly api routes
app.use('/run', runRouter);
// add all routes from routes/user.js, mostly api routes
app.use('/user', userRouter);

// function to render the homepage, uses the ejs file views/index.ejs
app.get("/", function (req, res) {
    res.render("index", {});
});


// function to render an overview of runners.
app.get("/wachtrij", function (req, res) {
    res.render("wachtrij", {});
});

// function to render an admin page where runners can be marked as runned or skipped , uses the ejs file views/admin_dashboard.ejs
// this is the main dashboard
app.get("/admin", function (req, res) {
    res.render("admin_dashboard", {});
});

// function to render an admin page to register runners, uses the ejs file views/newuser.ejs
app.get("/admin/new", function (req, res) {
    res.render("newuser", {});
});

// function to render an admin page to add runners TO THE QUEUE, uses the ejs file views/addrun.ejs
app.get("/admin/run", async function (req, res) {
    let db_url = process.env.DB_URL || "data.db";

    let db = await aaSqlite.open(db_url);

    let runners = await aaSqlite.all(db, `select id, ( first_naam || " " || last_name ) as name from runners;`);

    await aaSqlite.close(db);
    res.render("addrun", {runners:runners});
});


startDB()

module.exports = app;
