#include "user.h"

using namespace std;
using json = nlohmann::json;

json register_user(string password, string username) {

    json x;
    int boolean = 0;
/*
    try {

        sql::Driver* driver = get_driver_instance();
        sql::Connection* con = driver->connect(DB_URL, DB_USER, DB_PASSWORD);

        con->setSchema(DB_SHEMA);
        sql::PreparedStatement* stmt = con->prepareStatement("select username from login where username = ?");
        stmt->setString(1, username);
        sql::ResultSet* res = stmt->executeQuery();
        if (res->next()) {
            boolean = 1;
            x["username"] = res->getString("username");
            x["error"] = "user already exists";
        }
        stmt->close();
        con->close();
        delete res, con;
        driver->threadEnd();
        delete stmt, driver;
    }
    catch (sql::SQLException& e) {
        
        cout << "# ERR: SQLException in " << __FILE__;
        cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
        cout << "# ERR: " << e.what();
        cout << " (MySQL error code: " << e.getErrorCode();
        cout << ", SQLState: " << e.getSQLState() << " )" << endl;
        x["error"] = "failed to find username";
        return x;
    }
    

    if (boolean) return x; // User already exists

    try {

        sql::Driver* driver = get_driver_instance();
        sql::Connection* con = driver->connect(DB_URL, DB_USER, DB_PASSWORD);

        con->setSchema(DB_SHEMA);
        sql::PreparedStatement* stmt = con->prepareStatement("insert into login (username,password) values (?, ?);");
        stmt->setString(1, username);
        stmt->setString(2, crypt(password.c_str(), "$6$Wh4t3v3rS4ltH3re$")); // $6$ geeft de gebruikte hash technologie aan, de rest is salt die nog random moet
        stmt->execute();
        stmt->close();
        con->close();
        delete con;
        driver->threadEnd();
        delete stmt, driver;

    }
    catch (sql::SQLException& e) {
        cout << "# ERR: SQLException in " << __FILE__;
        cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
        cout << "# ERR: " << e.what();
        cout << " (MySQL error code: " << e.getErrorCode();
        cout << ", SQLState: " << e.getSQLState() << " )" << endl;
        x["error"] = "failed to find id";
        return x;
    }
    */

    // maak jwt token
    auto token = jwt::create()
        .set_issuer("wealth")
        .set_payload_claim("username", jwt::claim(std::string(username)))
        .set_issued_at(std::chrono::system_clock::now())
        .set_expires_at(std::chrono::system_clock::now() + std::chrono::seconds{ 604800 })
        .sign(jwt::algorithm::hs256{ JWT_secret });
    x["token"] = ((string)token);
    return x;
}

json login_user(string username, string password) {
    json x;
   /* try {

        sql::Driver* driver = get_driver_instance();
        sql::Connection* con = driver->connect(DB_URL, DB_USER, DB_PASSWORD);


        con->setSchema(DB_SHEMA);
        sql::PreparedStatement* stmt = con->prepareStatement(
            "select username, password from (SELECT * FROM wealth.login_mail union SELECT * FROM wealth.login) as comp where username = ?;");
        stmt->setString(1, username);
        sql::ResultSet* res = stmt->executeQuery();
        if (res->next()) {
            string pass_store = res->getString("password");
            // extract used salt + hash algo identifier
            std::regex regex(R"~(^(\$6\$.*\$))~");
            std::smatch m;
            std::regex_search(pass_store, m, regex);
            string hash = m[1];
            // encrypt password using the extracted salt and hash
            string user_pass = crypt(password.c_str(), hash.c_str());
            // compare, can be don safer probrably using a non timing variant.
            if (user_pass == pass_store) {
                // generate token JWT
                auto token = jwt::create()
                    .set_issuer("wealth")
                    .set_payload_claim("username", jwt::claim(std::string(res->getString("username"))))
                    .set_issued_at(std::chrono::system_clock::now())
                    .set_expires_at(std::chrono::system_clock::now() + std::chrono::seconds{ 604800 })
                    .sign(jwt::algorithm::hs256{ JWT_secret });
                // set in repsonse
                x["token"] = ((string)token);
            }
            else {
                x["error"] = "failed to authenticate";
            }
        }
        else {
            x["error"] = "failed to authenticate";
        }
        stmt->close();
        con->close();
        delete con;
        driver->threadEnd();
        delete stmt, driver;


    }
    catch (sql::SQLException& e) {
        cout << "# ERR: SQLException in " << __FILE__;
        cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << endl;
        cout << "# ERR: " << e.what();
        cout << " (MySQL error code: " << e.getErrorCode();
        cout << ", SQLState: " << e.getSQLState() << " )" << endl;
        x["error"] = "failed to authenticate";
        return x;
    }
    */
    return x;
}