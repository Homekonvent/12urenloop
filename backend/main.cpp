// crow header
#define CROW_MAIN
#include <sqlite3.h>
#include "crow_all.h"
#include <regex>
#include <stdlib.h>
#include <algorithm>
#include <iostream>
#include <string>
#include <sys/stat.h>
// json nlohmann
#include "json.hpp"
// JWT, see github repo of jwt-cpp
#include <jwt-cpp/jwt.h>
#include "token.h"
#include "util.h"
// STD lib for crypt functionality
#include <unistd.h>
#include "config.h"
#include "user.h"

using namespace std;
using json = nlohmann::json;

/**
 * Start of program
 * @param argc
 * @param argv
 * @return
*/
int main(int argc, char *argv[]) {
    /* Proccessing arguments */
    // std port
    int port = 5050;
    // parse argument for second argument (new port)
    if (argc == 2 && is_numeric(argv[1])) {
        port = stoi(argv[1]);
    } else if (argc == 2) {
        cout << "Argument is not valid. It should be a port number, not: " << argv[1] << "\n" << endl;
        exit(1);
    }

    /* Welcome message server */
    cout << "--------------------------------------------------------" << endl;
    cout << "Welcome to the 12 uren loop HK server" << endl;
    cout << "Copyright Tibo Vanheule" << endl;
    cout << "--------------------------------------------------------" << endl << endl;;

    sqlite3* db;
    char* zErrMsg = 0;
    int rc;

    rc = sqlite3_open("test.db", &db);

    if (rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return(0);
    }
    else {
        fprintf(stderr, "Opened database successfully\n");
    }
    sqlite3_close(db);

    /* Routes */
    crow::SimpleApp app;

    app.loglevel(crow::LogLevel::Warning);

    // enable compression using gzip, zlib library required
    app.use_compression(crow::compression::algorithm::GZIP);


    CROW_ROUTE(app, "/api/login").methods("POST"_method)([](const crow::request &req) {
        // parse json
        auto x = json::parse(req.body);
        // return response of login_user function
        return login_user(x["username"], x["password"]).dump();
    });

    CROW_ROUTE(app, "/api/register").methods("POST"_method)([](const crow::request &req) {
        auto x = json::parse(req.body);
        return register_user(x["password"], x["username"]).dump();
    });

    app.port(port).multithreaded().run();
}