#ifndef WEALTH_USER_H
#define WEALTH_USER_H
#include <regex>
#include <stdlib.h>
#include <algorithm>
#include <iostream>
#include <string>

// json nlohmann
#include "json.hpp"
// JWT, see github repo of jwt-cpp
#include <jwt-cpp/jwt.h>
#include "token.h"
#include "util.h"
// STD lib for crypt functionality
#include <unistd.h>
#include "config.h"

using namespace std;
using json = nlohmann::json;

json register_user(string password, string username);

json login_user(string username, string password);

#endif //WEALTH_USER_H