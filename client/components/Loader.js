import React from "react";
import styled, { keyframes, css } from "styled-components";

const Loader = ({ small = false, center = true }) => {
    const spin = keyframes`
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    `;

    const Div = styled.div`
        border: ${small ? 5 : 10}px solid lightgrey;
        border-top: ${small ? 5 : 10}px solid black;
        width: ${small ? 40 : 100}px;
        height: ${small ? 40 : 100}px;
        border-radius: 50%;
        margin: ${center ? "auto" : "5px"};
        animation: ${spin} 2s linear infinite;
    `;

    return <Div />;
};

export default Loader;