import React from "react";
import styled, { keyframes, css } from "styled-components";

const Loader = () => {
    const spin = keyframes`
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    `;

    const Div = styled.div`
        border: 10px solid lightgrey;
        border-top: 10px solid black;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        animation: ${spin} 2s linear infinite;
    `;

    return <Div />;
};

export default Loader;