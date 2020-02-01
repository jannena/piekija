import React, { useState } from "react";
import styled from "styled-components";

const StyledExpandable = styled.div`
    border: 1px solid black;
    margin: 10px 0px;
`;

const StyledExpandableTitle = styled.div`
    width: 100%;
    line-height: 50px;
    background-color: lightgrey;
    padding-left: 20px;
    display: flex;
`;
const StyledExpandableContent = styled.div`
    padding: ${props => props.noPadding ? "0px" : "20px"};
    display: ${props => props.isOpen ? "block" : "none"}
`;

const Expandable = ({ defaultIsOpen = false, noPadding = false, title, children }) => {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return <StyledExpandable>
        <StyledExpandableTitle onClick={() => setIsOpen(!isOpen)}>
            <div style={{ fontSize: "2em", fontWeight: "bold", marginRight: 10 }}>{isOpen ? "-" : "+"}</div>
            <div>{title}</div>
        </StyledExpandableTitle>
        <StyledExpandableContent noPadding={noPadding} isOpen={isOpen}>{children}</StyledExpandableContent>
    </StyledExpandable>;
};

export default Expandable;