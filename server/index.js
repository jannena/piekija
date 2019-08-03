const app = require("./app");
const http = require("http");

const server = http.createServer(app);

server.listen({
    port: 3001
}, () => {
    console.log("Listening on port 3001");
});