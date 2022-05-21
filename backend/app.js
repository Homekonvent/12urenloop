let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const dotenv = require('dotenv');
var sqlite3 = require('sqlite3');


let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
// Set up Global configuration access
dotenv.config();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let db_url = process.env.DB_URL || "data.db";


const createTables = (newdb) => newdb.exec("", ()  => { });

function createDatabase() {
    let newdb = new sqlite3.Database(db_url, (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

const startDB = () => new sqlite3.Database(db_url, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        createDatabase();
        return;
    } else if (err) {
        console.log("Getting error " + err);
        exit(1);
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;
