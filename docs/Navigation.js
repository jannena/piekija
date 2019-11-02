import React, { useState } from "react";

const NavCategory = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <div class="category" onClick={() => setIsOpen(!isOpen)}>{title}</div>
        <div class={`category-content ${isOpen ? "show" : "hidden"}`}>
            {children}
        </div>
    </>;
};

const NavTitle = ({ title }) => <div class="title">{title}</div>

const Navigation = () => {
    return <div id="navigation">
        <NavCategory title="Käyttäjälle">
            <NavTitle title="Hakuohjeet" />
            <NavTitle title="Käyttäjäyili" />
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