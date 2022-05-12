import { API } from '@stoplight/elements';

import '@stoplight/elements/styles.min.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <API apiDescriptionDocument={apiDescriptionDocument} router="hash" />
    </div>
  );
}

const apiDescriptionDocument = {
  "openapi": "3.1.0",
  "info": {
    "title": "wealth",
    "version": "1.0"
  },
  "servers": [
    {
      "url": "http://wealth.tibovanheule.space/api/"
    }
  ],
  "paths": {
    "/login": {
      "post": {
        "summary": "",
        "operationId": "post-login",
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "description": "",
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "token"
                  ],
                  "x-examples": {
                    "example-1": {
                      "token": ""
                    }
                  }
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "token": "string"
                    }
                  }
                }
              },
              "application/xml": {
                "schema": {
                  "type": "object",
                  "properties": {}
                }
              }
            }
          },
          "400": {
            "description": "Bad Request",
            "content": {
              "application/json": {
                "schema": {
                  "description": "",
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "minLength": 1
                    },
                    "username": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "error",
                    "username"
                  ],
                  "x-examples": {
                    "example-1": {
                      "error": "user already exists",
                      "username": ""
                    }
                  }
                },
                "examples": {
                  "example-1": {
                    "value": {
                      "error": "failed to authenticate",
                      "username": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "description": "",
                "type": "object",
                "properties": {
                  "username": {
                    "type": "string",
                    "minLength": 1
                  },
                  "password": {
                    "type": "string",
                    "minLength": 1
                  }
                },
                "required": [
                  "username",
                  "password"
                ],
                "x-examples": {
                  "example-1": {
                    "username": "tibovanheule",
                    "password": "Sx945iG!tm6qXsL"
                  }
                }
              }
            }
          },
          "description": "{\n    \"username\":\"\",\n    \"password\":\"\"\n}"
        }
      }
    },
    "/register": {
      "post": {
        "summary": "",
        "operationId": "post-register",
        "responses": {
          "200": {
            "description": "OK",
            "headers": {},
            "content": {
              "application/json": {
                "schema": {
                  "description": "",
                  "type": "object",
                  "properties": {
                    "token": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "token"
                  ],
                  "x-examples": {
                    "example-1": {
                      "token": ""
                    }
                  }
                }
              }
            }
          }
        },
        "description": "",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {}
              }
            }
          },
          "description": "{\n    \"username\":\"\",\n    \"password\":\"\"\n}"
        }
      }
    }
  },
  "components": {
    "schemas": {},
    "securitySchemes": {}
  }
};

export default App;
