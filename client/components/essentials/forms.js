import React from "react";
import styled from "styled-components";

export const Form = ({ children, onSubmit }) => {
    return <div><form onSubmit={e => {
        e.preventDefault();
        onSubmit(e);
    }}>{children}</form></div>
};

const StyledContainer = styled.div`
    margin: 20px 0px;
    
    @media only screen and (min-width: 768px) {
        display: flex;
    }
`;
const StyledInputTitle = styled.div`
    width: 100%;

    @media only screen and (min-width: 768px) 
        width: 50%;
    }
`;
const StyledInputContainer = styled.div`
    width: 100%;
    
    @media only screen and (min-width: 768px) 
        width: 50%;
    }
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
    <input style={{ width: "100%" }} className={props.className} id={props.id || props.name} name={props.name} type={props.type} defaultValue={props.value} />
</InputTemplate>

export const Text = props => <InputTemplate {...props}>
    <span>{props.value}</span>
</InputTemplate>;

export const Button = ({ title, className }) => {
    return <div style={{ textAlign: "center", margin: "20px 0px" }}>
        <button className={className}>{title}</button>
    </div>;
};

export const DoNotSendButton = ({ title, onClick, className }) => {
    return <div style={{ textAlign: "center", margin: "20px 0px" }}>
        <button className={className} style={{ backgroundColor: "#ff5c5c" }} onClick={onClick} type="button">{title}</button>
    </div>;
};

export const Grid = ({ children }) => {
    return <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        {children}
    </div>;
};

// TODO: Fix default values
export const FormSelect = props => {
    console.log(props);
    return <InputTemplate {...props}>
        <select className={props.className} id={props.id || props.name} name={props.name} defaultValue={props.selected}>
            {props.options.map(o => <option key={o[1]} value={o[1]}>{o[0]}</option>)}
        </select>
    </InputTemplate>
};

export const Checkbox = props => <InputTemplate {...props}>
    <input type="checkbox" id={props.id || props.name} name={props.name} defaultChecked={props.checked} />
</InputTemplate>;