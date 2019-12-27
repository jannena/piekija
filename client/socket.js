import openSocket from "socket.io-client";

let io = openSocket(`//${location.hostname}:3001`);
export default io;

export const startWS = () => {
    console.log("[SIO] Connect to", `//${location.hostname}:3001`);
    // io = openSocket(`//${location.hostname}:3001`);
};

export const setSocketIOEventListeners = (addRecord, removeRecord, updateRecord, changeShelf, localShare, localUnshare, localUpdate, localRemove) => {
    io.removeAllListeners();
    io.on("add record", addRecord);
    io.on("remove record", removeRecord);
    io.on("update record", updateRecord);
    io.on("change shelf", changeShelf);
    io.on("share", localShare);
    io.on("unshare", localUnshare); // TODO: If it is me, remove all listeners and close the connection.
    io.on("update", localUpdate);
    io.on("remove", localRemove);
};