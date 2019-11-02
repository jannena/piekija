import React from "react";
import { Route } from "react-router-dom";

import Start from "./content/Start.mdx";
import SearchHelp from "./content/SearchHelp.mdx";

const Container = () => {
    return <div id="content">
        <Route exact path="/docs/" component={Start} />
        <Route exact path="/docs/search-help" component={SearchHelp} />
    </div>;
};

export default Container;