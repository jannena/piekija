import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";

const StyledUserMenuItem = styled.div`
    line-height: 50px;
`;
const StyledUserMenuTitle = styled.div`
    display: block;
    line-height: 50px;
`;

const MenuItem = ({ title, link }) => <StyledUserMenuItem><Link to={link}>{title}</Link></StyledUserMenuItem>;

const UserMenu = ({ isLoggedIn, isStaff, user, history }) => {
    const [isOpen, setIsOpen] = useState(false);

    const logout = () => {
        window.localStorage.clear();
        location.reload();
    };

    const handleMenuClick = () => isLoggedIn
        ? setIsOpen(!isOpen)
        : history.push("/login");

    return <div>
        <StyledUserMenuTitle onClick={handleMenuClick}>{isLoggedIn ? user.name : "Log in"}</StyledUserMenuTitle>
        <div style={{ display: isOpen ? "block" : "none" }}>
            <MenuItem title="You" link="/user" />
            {isStaff && <MenuItem title="Staff" link="/staff" />}
            <StyledUserMenuItem onClick={logout}>Logout</StyledUserMenuItem>
        </div>
    </div>;
};

export default connect(
    state => ({
        isLoggedIn: !!state.user,
        user: state.user,
        isStaff: state.user && state.user.staff === true
    }),
    {}
)(withRouter(UserMenu));