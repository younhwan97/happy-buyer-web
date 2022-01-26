"use strict";

const server = require("../app")
const PORT = 80

server.listen(PORT, () => {
    console.log(`Success: Started Happy Buyer Web!`);
})
