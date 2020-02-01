import React from "react";
import { Route } from "react-router-dom";

import Start from "./content/Start.mdx";
import SearchHelp from "./content/SearchHelp.mdx";
import Account from "./content/Account.mdx";
import Staff from "./content/Staff.mdx";
import Records from "./content/Records.mdx";
import Circulation from "./content/Circulation.mdx";
import Users from "./content/Users.mdx";
import Statistics from "./content/Statistics.mdx";
import Notes from "./content/Notes.mdx";
import MARC21 from "./content/MARC21.mdx";
import Installation from "./content/Installation.mdx";
import RESTAPI from "./content/RESTAPI.mdx";
import AdvancedSearch from "./content/AdvancedSearch.mdx";

const Container = () => {
    return <div id="content">
        <Route exact path="/docs/" component={Start} />

        <Route exact path="/docs/search-help" component={SearchHelp} />
        <Route exact path="/docs/user-account" component={Account} />

        <Route exact path="/docs/records" component={Records} />
        <Route exact path="/docs/staff" component={Staff} />
        <Route exact path="/docs/circulation" component={Circulation} />
        <Route exact path="/docs/users" component={Users} />
        <Route exact path="/docs/statistics" component={Statistics} />
        <Route exact path="/docs/notes" component={Notes} />
        <Route exact path="/docs/marc21" component={MARC21} />

        <Route exact path="/docs/installation" component={Installation} />
        <Route exact path="/docs/rest" component={RESTAPI} />
        <Route exact path="/docs/advanced-search-ml" component={AdvancedSearch} />
    </div>;
};

export default Container;