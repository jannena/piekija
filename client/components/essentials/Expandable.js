import React, { useState } from "react";

const Expandable = ({ defaultIsOpen = false, title, children }) => {
    const [isOpen, setIsOpen] = useState(defaultIsOpen);

    return <div>
        <div onClick={() => setIsOpen(isOpen)}>{title}</div>
        {isOpen && <div>{children}</div>}
    </div>;
};

export default Expandable;