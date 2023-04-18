const app = require("./app.js");
const dotenv = require('dotenv');
// Set up Global configuration access
dotenv.config();
let port = 4600;

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});
