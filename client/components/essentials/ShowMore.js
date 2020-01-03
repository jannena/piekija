import React, { useState } from "react";

const ShowMore = ({ data, show }) => {
    const [showAll, setShowAll] = useState(false);

    const showDefault = data.slice(0, show);
    const rest = data.slice(show);

    return (<div>
        <div>
            {showDefault}
        </div>
        {showAll && <div>{rest}</div>}
        <button onClick={() => setShowAll(!showAll)}>{showAll ? "Hide" : "Show"}</button>
    </div>);
};

export default ShowMore;