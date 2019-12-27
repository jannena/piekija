import { useState, useEffect } from "react";

export const useField = type => {
    const [value, setValue] = useState("");

    const reset = () => setValue("");
    const onChange = e => setValue(e.target.value);

    return {
        value,
        type,
        onChange,
        reset,
        props: {
            type, value, onChange
        }
    }
};

// https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
export const useClickOutside = (callback, ref) => {
    const onOutsideClick = e => {
        if (ref.current && !ref.current.contains(e.target)) {
            // console.log("You have clicked outside me!");
            callback(e);
        }
    };

    useEffect(() => {
        window.addEventListener("mousedown", onOutsideClick);
        return () => window.removeEventListener("mousedown", onOutsideClick);
    });
};