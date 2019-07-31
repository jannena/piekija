import React, { useState } from "react";

const Tab = ({ children }) => {
    return children;
};

// TODO: Ulkoasu joskus
const Tabs = ({ titles, children }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div>
            {titles.map((title, i) => <span key={i} onClick={() => setSelectedTab(i)}>{title}</span>)}
            {children[selectedTab]}
        </div>
    );
};

export {
    Tab,
    Tabs
};