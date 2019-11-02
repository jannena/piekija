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
            <NavTitle title="Käyttäjätili" />
            <NavTitle title="Hyllyt" />
        </NavCategory>
        <NavCategory title="Henkilökunnalle">
            <NavTitle title="Tietueet" />
            <NavTitle title="Sijainnit, lainaustyypit ja esineet" />
            <NavTitle title="PieKiJan MARC21-erikoisuudet" />
        </NavCategory>
        <NavCategory title="Kehittäjälle">
            <NavTitle title="Asennus" />
            <NavTitle title="REST API" />
        </NavCategory>
    </div>;
};

export default Navigation;