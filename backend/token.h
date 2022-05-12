#ifndef WEALTH_TOKEN_H
#define WEALTH_TOKEN_H
#include "config.h"
#include "json.hpp"
#include <jwt-cpp/jwt.h>

using namespace std;
using json = nlohmann::json;
/**
 * Get information out of a token and also verify a token
 * @param x json object containing token
 * @return json object containing token information
 */
json extract_verify_token(json x);

static auto verifier = jwt::verify()
        .allow_algorithm(jwt::algorithm::hs256{JWT_secret})
        .with_issuer("wealth");

#endif //WEALTH_TOKEN_H
