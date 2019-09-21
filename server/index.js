const app = require("./app");
const http = require("http");

const server = http.createServer(app);

// Start the socket.io server
require("./socket").start(server);

server.listen({
    port: 3001
}, () => {
    console.log("Listening on port 3001");
});