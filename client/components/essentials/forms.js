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

const InputTemplate = ({ id, name, title, description, children }) => <StyledContainer>
    <StyledInputTitle>
        <label style={{ lineHeight: "30px", fontSize: "1.1em", display: "block" }} htmlFor={id || name}>{title}</label>
        <div style={{ color: "#717171" }}>{description}</div>
    </StyledInputTitle>
    <StyledInputContainer>
        {children}
    </StyledInputContainer>
</StyledContainer>

export const Textarea = props => <InputTemplate {...props}>
    <textarea style={{ width: "100%", height: "200px" }} id={props.id || props.name} name={props.name} defaultValue={props.value} />
</InputTemplate>;

export const Input = props => <InputTemplate {...props}>
    <input style={{ width: "100%" }} id={props.id || props.name} name={props.name} type={props.type} defaultValue={props.value} />
</InputTemplate>

export const Button = ({ title }) => {
    return <div style={{ textAlign: "center", margin: "20px 0px" }}>
        <button>{title}</button>
    </div>
};

// TODO: Fix default values
export const FormSelect = props => {
    console.log(props);
    return <InputTemplate {...props}>
        <select id={props.id || props.name} name={props.name} defaultValue={props.selected}>
            {props.options.map(o => <option key={o[1]} value={o[1]}>{o[0]}</option>)}
        </select>
    </InputTemplate>
};

export const Checkbox = props => <InputTemplate {...props}>
    <input type="checkbox" id={props.id || props.name} name={props.name} defaultChecked={props.checked} />
</InputTemplate>;