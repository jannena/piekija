import React, { useState } from "react";

export const Table = ({ children, widths, data, colors = ["grey", "lightgrey"], form }) => {
    return React.Children.map(children, (child, i) =>
        React.cloneElement(child, { data: data[i], widths, form, color: colors[i % 2] })
    );
};

export const TableRow = ({ children, widths, data, color, form }) => {
    console.log(children);
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <div style={{ backgroundColor: color, display: "flex", padding: "10px 0px" }}>
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
        {isOpen && <div style={{ width: "100%", marginBottom: 10 }}>{form(data)}</div>}
    </>
};

export const TableCell = ({ children, style }) => {
    console.log(style);
    return <div style={{ ...style }}>{children}</div>;
};