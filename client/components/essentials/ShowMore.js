import React, { useState } from "react";

const ShowMore = ({ data, show, noDiv, buttonContainer }) => {
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

    const button = <button style={buttonStyle} onClick={() => setShowAll(!showAll)}>{showAll ? <>&uarr; Hide</> : <>&darr; Show more</>}</button>;

    if (noDiv) return <>
        {showDefault}
        {showAll && rest}
        {buttonContainer(button)}
    </>;

    return (<div>
        <div>
            {showDefault}
        </div>
        {showAll && <div>{rest}</div>}
        {button}
    </div>);
};

export default ShowMore;