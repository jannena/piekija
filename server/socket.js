
let socket;

/**
 * @type {{socket: SocketIO.Server}}
 */
module.exports = {
    start: http => {
        socket = require("socket.io")(http);
        socket.on("connection", conn => {
            console.log("[SIO]: Wow! A connection!");
            conn.on("change shelf", shelfId => {
                // TODO: Add authentication
                conn.leave(conn.rooms[0]);
                conn.join(`shelf-${shelfId}`);
                conn.emit("change shelf", shelfId);
            });
        });
        module.exports.socket = socket;
        /* setInterval(() => {
            console.log(socket.sockets.clients("shelf-5d7525d15a57a12aac18c3e6").map(j => j.conn.id))
        }, 3000); */
    }
};