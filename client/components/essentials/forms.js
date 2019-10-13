import React from "react";
import styled from "styled-components";

export const Form = ({ children, onSubmit }) => {
    return <div><form onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
    }}>{children}</form></div>
};

const StyledContainer = styled.div`
    display: flex;
    margin: 20px 0px;
`;
const StyledInputTitle = styled.div`
    width: 50%;
`;
const StyledInputContainer = styled.div`
    width: 50%;
`;

export const Input = ({ id = null, name, title, description, value, type = "text" }) => {
    return (
        <StyledContainer>
            <StyledInputTitle>
                <label style={{ lineHeight: "30px", fontSize: "1.1em", display: "block" }} htmlFor={id || name}>{title}</label>
                <div style={{ color: "#717171" }}>{description}</div>
            </StyledInputTitle>
            <StyledInputContainer>
                {type !== "textarea"
                    ? <input style={{ width: "100%" }} id={id || name} name={name} type={type} defaultValue={value} />
                    : <textarea style={{ width: "100%", height: "200px" }} id={id || name} name={name} defaultValue={value} />}
            </StyledInputContainer>
        </StyledContainer>
    );
};

export const Button = ({ title }) => {
    return <div style={{ textAlign: "center", margin: "20px 0px" }}>
        <button>{title}</button>
    </div>
};