import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavCategory = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <div class="category" onClick={() => setIsOpen(!isOpen)}>{title}</div>
        <div class={`category-content ${isOpen ? "show" : "hidden"}`}>
            {children}
        </div>
    </>;
};

const NavTitle = ({ title, address }) => <div class="title"><Link to={`/docs/${address}`}>{title}</Link></div>

const Navigation = () => {
    return <div id="navigation">
        <NavTitle title="Aloitus" address="" />
        <NavCategory title="Käyttäjälle">
            <NavTitle title="Hakuohjeet" address="search-help" />
            <NavTitle title="Käyttäjätili ja hyllyt" address="user-account" />
        </NavCategory>
        <NavCategory title="Henkilökunnalle">
            <NavTitle title="Nimityksiä" address="staff" />
            <NavTitle title="Tietueet" address="records" />
            <NavTitle title="Lainaaminen" address="circulation" />
            <NavTitle title="Käyttäjien hallinta" address="users" />
            <NavTitle title="Etusivu-uutiset" address="notes" />
            <NavTitle title="Tilastot" address="statistics" />
            <NavTitle title="PieKiJa ja MARC21" address="marc21" />
        </NavCategory>
        <NavCategory title="Kehittäjälle">
            <NavTitle title="Asennus" address="installation" />
            <NavTitle title="REST API" address="rest" />
            <NavTitle title="Advanced search" address="advanced-search-ml" />
        </NavCategory>
    </div>;
};

export default Navigation;