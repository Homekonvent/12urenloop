#ifndef WEALTH_UTIL_H
#define WEALTH_UTIL_H
#include <stdlib.h>
#include <string>
// Boost uuid libraries
#include <boost/uuid/uuid.hpp>            // uuid class
#include <boost/uuid/uuid_generators.hpp> // generators
#include <boost/uuid/uuid_io.hpp>         // streaming operators etc.
#include <iostream>
#include <sstream>
#include <iomanip>

using namespace std;

string uuid_id();

/* functions to check if nummeric */
bool is_digit(const char value);

bool is_numeric(const string &value);

string floattostring(float f);

enum lang {
    ENG, NL
};

#endif //WEALTH_UTIL_H
