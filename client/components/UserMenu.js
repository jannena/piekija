import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { useClickOutside } from "../hooks";
import __ from "../langs";

const StyledUserMenuItem = styled.div`
    line-height: 50px;
`;
const StyledUserMenuTitle = styled.div`
    display: block;
    line-height: 50px;
`;
const isOpenStyle = {
    height: 220,
    backgroundColor: "black",
    padding: 10,
    paddingTop: 0,
    width: "20%",
    zIndex: 1000
};
const isClosedStyle = {
    width: "20%",
    minWidth: 100,
    paddingLeft: 10,
    zIndex: 1000
};

const MenuItem = ({ title, link }) => <StyledUserMenuItem><Link to={link}>{title}</Link></StyledUserMenuItem>;

const UserMenu = ({ isLoggedIn, isStaff, user, history, __ }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();
    useClickOutside(() => {
        if (!isOpen) return;
        setIsOpen(false);
    }, ref);

    const logout = () => {
        window.localStorage.clear();
        location.reload();
    };

    const handleMenuClick = () => isLoggedIn
        ? setIsOpen(!isOpen)
        : history.push("/login");

    return <div ref={ref} style={isOpen ? isOpenStyle : isClosedStyle}>
        <StyledUserMenuTitle onClick={handleMenuClick}>{isLoggedIn ? user.name : __("Log in")}</StyledUserMenuTitle>
        <div style={{ display: isOpen ? "block" : "none" }}>
            <MenuItem title={__("You")} link="/user" />
            {isStaff && <MenuItem title={__("Staff")} link="/staff" />}
            <StyledUserMenuItem onClick={logout}>{__("Logout")}</StyledUserMenuItem>
        </div>
    </div>;
};

export default connect(
    state => ({
        isLoggedIn: !!state.user,
        user: state.user,
        isStaff: state.user && state.user.staff === true,
        __: __(state)
    }),
    {}
)(withRouter(UserMenu));