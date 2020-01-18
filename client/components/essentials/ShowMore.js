import React, { useState } from "react";
import { connect } from "react-redux";
import __ from "../../langs";

const ShowMore = ({ data, show, noDiv, buttonContainer, __ }) => {
    const [showAll, setShowAll] = useState(false);

    const showDefault = data.slice(0, show);
    const rest = data.slice(show);

    const buttonStyle = {
        margin: "auto",
        marginTop: 10,
        marginBottom: 10,
        maxWidth: 200,
        width: "100%"
    };

    const button = <button style={buttonStyle} onClick={() => setShowAll(!showAll)}>{showAll ? <>&uarr; {__("Hide")}</> : <>&darr; {__("Show more")}</>}</button>;

    if (noDiv) return <>
        {showDefault}
        {showAll && rest}
        {buttonContainer(button)}
    </>;

    return (<div>
        <div>
            {showDefault}
        </div>
        {rest.length > 0 && showAll && <div>{rest}</div>}
        {rest.length > 0 && button}
    </div>);
};

export default connect(
    state => ({
        __: __(state)
    })
)(ShowMore);