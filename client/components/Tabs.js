import React, { useState } from "react";
import { Route } from "react-router-dom";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

const StyledTabTitle = styled.div`
    color: white;
    background-color: black;
    line-height: 50px;
    padding: 0px 10px;
    margin-bottom: -1px;
`;

const StyledTabTitlesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    background-color: black;
`;

const StyledSelectedTabTitle = styled.div`
    color: black;
    background-color: white;
    line-height: 50px;
    padding: 0px 10px;
    border-top: 2px solid black;
    border-left: 2px solid black;
    border-right: 2px solid black;
    margin-bottom: -1px;
    box-shadow: 0px 0px 10px white;
    z-index: 999;
`;
const StyledTabContainer = styled.div`
    border: 1px solid black;
    padding: 10px;
`;

export const Tab = ({ children }) => {
    return <div>{children}</div>;
};

const TabsWithoutRouter = ({ titles, root, addresses, children, history }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    if (titles.length !== addresses.length || titles.length !== children.length) {
        console.error(`length of titles (${titles.length}), addresses (${addresses.length}) and children (${children.length}) are not equal.`);
        return <div>Error</div>;
    }

    const handleTabChange = i => () => {
        history.push(`/${root}/${addresses[i]}`);
        // setSelectedTab(i);
    };

    return (
        <div className="tabs addressed-tabs">
            <StyledTabTitlesContainer>
                {titles.map((title, i) => i === selectedTab
                    ? <StyledSelectedTabTitle key={i} onClick={handleTabChange(i)}>{title}</StyledSelectedTabTitle>
                    : <StyledTabTitle key={i} onClick={handleTabChange(i)}>{title}</StyledTabTitle>
                )}
            </StyledTabTitlesContainer>
            {children.map((child, i) =>
                <Route exact path={`/${root}/${addresses[i]}`} render={() => <StyledTabContainer>
                    {setSelectedTab(i)}
                    {child}
                </StyledTabContainer>} />
            )}
        </div>
    );
};

export const AddressedTabs = withRouter(TabsWithoutRouter);

export const Tabs = ({ titles, children }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <div className="tabs">
            <StyledTabTitlesContainer>
                {titles.map((title, i) => i === selectedTab
                    ? <StyledSelectedTabTitle key={i} onClick={() => setSelectedTab(i)}>{title}</StyledSelectedTabTitle>
                    : <StyledTabTitle key={i} onClick={() => setSelectedTab(i)}>{title}</StyledTabTitle>)}
            </StyledTabTitlesContainer>
            <StyledTabContainer>{children[selectedTab]}</StyledTabContainer>
        </div>
    );
};