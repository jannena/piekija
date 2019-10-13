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
    return <>
        <div onClick={() => setIsOpen(!isOpen)} style={{ backgroundColor: color, display: "flex", padding: "10px 0px" }}>
            {React.Children.map(children, (child, i) => {
                if (i === 0) return <TableCell>
                    <a onClick={() => setIsOpen(!isOpen)} href="javascript:void(0);">
                        {React.Children.toArray(child)[0]}
                    </a>
                </TableCell>
                return React.cloneElement(child, { style: { width: `${(widths && widths[i]) || 0}%` } })
            }
            )}
            {/* <div style={{ backgroundColor: color }}><button onClick={() => setIsOpen(!isOpen)}>Open</button></div> */}

        </div>
        <div style={{ width: "100%", marginBottom: 10, display: isOpen ? "block" : "none" }}>{form(data)}</div>
    </>
};

export const TableCell = ({ children, style }) => {
    console.log(style);
    return <div style={{ ...style }}>{children}</div>;
};