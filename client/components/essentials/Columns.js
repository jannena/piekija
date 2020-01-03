import React from "react";
import styled from "styled-components";

export const Column = styled.div`
    flex-basis: 0;
    flex-grow: 1;
    padding: 5px;
`;

export const Columns = styled.div`
    display: flex;
    flex-basis: auto;
    flex-wrap: wrap;
    flex-direction: column;
    padding-left: 20px;
    
    @media screen and (min-width: 800px) {
        flex-direction: row;
    }
`;

// export const Column = ({ children }) => <div style={{ flexBasis: 0, flexGrow: 1, padding: 5 }}>{children}</div>
// export const Columns = ({ children, width }) => <div style={{ display: "flex", flexBasis: "auto" }}>{children}</div>;