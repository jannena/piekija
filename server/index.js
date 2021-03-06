const app = require("./app");
const http = require("http");

const server = http.createServer(app);

// Start the socket.io server
require("./socket").start(server);

const PORT = process.env.PORT || 3001;
server.listen({
    port: PORT
}, () => {
    console.log(`Listening on port ${PORT}`);
});



const graphql = require("./graphql");
const { ENABLE_GRAPHQL } = require("./utils/config");

if (ENABLE_GRAPHQL) graphql.listen().then(({ url, subscriptionsUrl }) => {
    console.log("GraphQL running at", url);
    console.log("Listening subscriptions at", subscriptionsUrl);
});