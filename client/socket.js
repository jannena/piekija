import openSocket from "socket.io-client";

console.log("[SIO] Connect to", `//${location.hostname}:3001`)
const io = openSocket(`//${location.hostname}:3001`);
io.on("add record", data => {
    console.log("Someone added a record", data);
});
io.on("change shelf", shelfId => {
    console.log("Changed shelf to", shelfId);
});

export default io;