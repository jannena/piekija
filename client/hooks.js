import { useState } from "react";

const useField = type => {
    const [value, setValue] = useState("");

    return {
        type,
        value,
        reset: () => setValue(""),
        onChange: e => setValue(e.target.value)
    }
};

export default {
    useField
};