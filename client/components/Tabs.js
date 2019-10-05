import React, { useState } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";

export const Tab = ({ children }) => {
    return <div>{children}</div>;
};

// TODO: Ulkoasu joskus
const TabsWithoutRouter = ({ titles, root, addresses, children, history }) => {
    if (titles.length !== addresses.length || titles.length !== children.length) {
        console.error("length of titles, addresses and children are not equal.");
        return <div>Error</div>;
    }

    return (
        <div>
            {titles.map((title, i) => <span key={i} onClick={() => history.push(`/${root}/${addresses[i]}`)}>{title}</span>)}
            {children.map((child, i) => <Route exact path={`/${root}/${addresses[i]}`} render={() => child} />)}
        </div>
    );
};

export const AddressedTabs = withRouter(TabsWithoutRouter);

export const Tabs = ({ titles, children }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div>
            {titles.map((title, i) => <span key={i} onClick={() => setSelectedTab(i)}>{title}</span>)}
            <div>{children[selectedTab]}</div>
        </div>
    );
};