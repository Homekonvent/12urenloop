#include "token.h"

using namespace std;
using json = nlohmann::json;

json extract_verify_token(json x) {

    string token = x["token"];
    token = token.substr(7);
    auto decoded = jwt::decode(token);

    try {
        verifier.verify(decoded);
    } catch (jwt::token_verification_exception &e) {
        json j;
        j["error"] = e.what();
        return j;
    }

    json k;

    for (auto &e : decoded.get_payload_claims()) {
        if (e.first == "username") {
            k["username"] = e.second.as_string();
        }
    }
    return k;
}
