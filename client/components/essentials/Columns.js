import React from "react";

export const Column = ({ children }) => <div style={{ flexBasis: 0, flexGrow: 1, padding: 5 }}>{children}</div>
export const Columns = ({ children, width }) => <div style={{ display: "flex", flexBasis: "auto" }}>{children}</div>;