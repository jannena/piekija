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
`;

// TODO: Add logo?

const Expandable = ({ defaultIsOpen = false, title, children }) => {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return <StyledExpandable>
        <StyledExpandableTitle onClick={() => setIsOpen(!isOpen)}>{title}</StyledExpandableTitle>
        {isOpen && <div>{children}</div>}
    </StyledExpandable>;
};

export default Expandable;