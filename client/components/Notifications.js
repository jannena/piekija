import React from "react";
import { connect } from "react-redux";


const Notifications = ({ notifications }) => {
    const notificationContainerStyle = {
        position: "fixed",
        width: 200,
        height: "100%",
        top: 0,
        right: 0
    };
    const notificationStyle = type => ({
        padding: 30,
        borderRadius: 12,
        backgroundColor: (type === "error" ? "red" : type === "warning" ? "yellow" : "green"),
        transition: "opacity 1s linear",
        opacity: 1
    });

    return (<div style={notificationContainerStyle}>
        {notifications.map(({ type, message }) =>
            <div style={notificationStyle(type)}>{message}</div>
        )}
    </div>);
};

export default connect(
    state => ({
        notifications: state.notifications
    })
)(Notifications);