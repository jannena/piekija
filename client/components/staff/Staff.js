import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

const Staff = ({ user, staff }) => {
    if (!staff) return <p>Forbidden!</p>;

    return <p>Welcome!
        <Link to="/staff/record/moi">Muokkaa</Link>
    </p>;
};

export default connect(
    state => ({
        user: state.user,
        staff: state.user ? state.user.staff : false
    })
)(Staff);