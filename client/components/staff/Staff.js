import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Tab, Tabs } from "../Tabs";
import { createRecord } from "../../reducers/recordReducer";
import Scanner from "./Scanner";
import axios from "axios";

const Staff = ({ isStaffUser, createRecord }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [searchResult, setSearchResult] = useState({});

    if (!isStaffUser) return <p>Forbidden!</p>;

    const createEmptyRecordFromTemplate = () => {
        createRecord("00367cam a2200133La 4500001001200000005001700012008004100029020000900070100003300079245004400112300002800156500002800184700002100212000448147-X20020606090541.3860327s1985    fi a          000 0 fin d  aISBN1 aMeikalainen, Matti,eauthor.10aTitle /bsubtitle :cpossible creators.  a67 p. :bill. ;c23 cm.  aThis is a general note!1 aCreator, Another")
    };

    const handleSearchSubmit = e => {
        e.preventDefault();

        const lookFor = e.target.code.value;

        console.log("look for", lookFor);

        axios
            .get(`https://api.finna.fi/api/v1/search?lookfor=${lookFor}&field[]=id&field[]=title&field[]=fullRecord`)
            .then(response => {
                setSearchResult(response.data);
                console.log("got", response);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return <Tabs titles={["Welocme ", "Records ", "Items ", "Loantypes ", "Users "]}>
        <Tab>
            <p>Welocme!</p>
        </Tab>
        <Tab>
            <button onClick={createEmptyRecordFromTemplate}>Create empty record from template</button>
            <button onClick={() => setShowScanner(!showScanner)}>Add record by scanning EAN code</button>
            {showScanner && <Scanner />}

            <form onSubmit={handleSearchSubmit}>
                <input name="code" placeholder="ISBN or EAN" />
                <button>Search databases for this record</button>
            </form>

            {searchResult.resultCount && searchResult.records.map(r => <div>{r.title} - {r.id}</div>)}
        </Tab>
    </Tabs>
};

export default connect(
    state => ({
        isStaffUser: state.user ? state.user.staff : false
    }),
    { createRecord }
)(Staff);