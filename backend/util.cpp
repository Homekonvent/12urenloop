#include "util.h"


std::string uuid_id() {
    boost::uuids::uuid uuid = boost::uuids::random_generator()();
    return boost::uuids::to_string(uuid);
}

/* functions to check if nummeric */
bool is_digit(const char value) { return isdigit(value); }

bool is_numeric(const string &value) { return all_of(value.begin(), value.end(), is_digit); }

string floattostring(float f) {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2) << f;
    return ss.str();
}
