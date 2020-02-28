import React, { useState } from "react";

export const Table = ({ children, widths, titles, data, colors = ["#dcdcdc", "#f5f5f5"], form }) => {
    return (
        <div>
            <div style={{ display: "flex", lineHeight: "50px", backgroundColor: "black", color: "white", paddingLeft: "20px" }}>
                {titles.map((title, i) => <div key={title} style={{ width: `${widths[i]}%` }}>{title}</div>)}
            </div>
            {React.Children.map(children, (child, i) =>
                React.cloneElement(child, { data: data[i], widths, form, color: colors[i % 2] })
            )}
        </div>);
};

// TODO: Close after save
// TODO: Change colors
export const TableRow = ({ children, widths, data, color, form }) => {
    console.log(children);
    const [isOpen, setIsOpen] = useState(false);
    return <div /* style={{ margin: isOpen ? "20px 0px" : "0px 0x" }} */>
        <div onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: color, display: "flex", padding: "10px 20px" }}>
            {React.Children.map(children, (child, i) =>
                React.cloneElement(child, { style: { width: `${(widths && widths[i]) || 0}%` } })
            )}
            {/* <div style={{ backgroundColor: color }}><button onClick={() => setIsOpen(!isOpen)}>Open</button></div> */}

        </div>
        <div className="table-content" style={{ boxShadow: isOpen ? "black 0px 0px 50px" : "none", width: "100%", border: "1px solid black", padding: 20, marginBottom: 10, display: isOpen ? "block" : "none" }}>{form(data)}</div>
    </ div>
};

export const TableCell = ({ children, style }) => {
    console.log(style);
    return <div style={{ ...style }}>{children}</div>;
};