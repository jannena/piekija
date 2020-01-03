import React from "react";
import { connect } from "react-redux";
import { unnotify } from "../reducers/notificationReducer";
import __ from "../langs";


const Notifications = ({ notifications, unnotify, __ }) => {
    const notificationContainerStyle = {
        position: "fixed",
        width: "100%",
        maxWidth: 300,
        // height: "100%",
        top: 20,
        right: 20,
        zIndex: 2000
    };
    const notificationStyle = type => ({
        padding: 30,
        borderRadius: 12,
        backgroundColor: (type === "error" ? "#ff3e3e" : type === "warning" ? "yellow" : "#43ff43"),
        border: "1px solid",
        borderColor: (type === "error" ? "red" : type === "warning" ? "yellow" : "green"),
        boxShadow: (type === "error" ? "0 0 20px red" : type === "warning" ? "0 0 20px yellow" : "0 0 20px green"),
        transition: "opacity 1s linear",
        opacity: 1,
        position: "relative"
    });
    const removeNotificationStyle = {
        position: "absolute",
        top: 10,
        right: 10
    };

    return (<div style={notificationContainerStyle}>
        {notifications.map(({ timeout, type, message: [message, extension] }) =>
            <div style={notificationStyle(type)}>
                <div>{__(message)} {extension}</div>
                <div onClick={() => unnotify(timeout)} style={removeNotificationStyle}>x</div>
            </div>
        )}
    </div>);
};

export default connect(
    state => ({
        notifications: state.notifications,
        __: __(state)
    }),
    { unnotify }
)(Notifications);