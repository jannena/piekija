import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Tab, Tabs, AddressedTabs } from "../Tabs";
import { createRecord, createTemporaryRecord } from "../../reducers/recordReducer";
import Scanner from "./Scanner";
import axios from "axios";
import StaffLocations from "./StaffLocations";
import StaffLoantypes from "./StaffLoantypes";
import Circulation from "./Circulation";
import StaffUser from "./StaffUser";
import StaffNotes from "./StaffNotes";
import __ from "../../langs";
import StaffStatistics from "./StaffStatistics";

const MARC21 = require("../../../server/utils/marc21parser");

const Staff = ({ isStaffUser, createRecord, createTemporaryRecord, history, __ }) => {
    const [showScanner, setShowScanner] = useState(false);
    const [searchResult, setSearchResult] = useState({});

    if (!isStaffUser) return <p>{__("Forbidden!")}</p>;

    document.title = "Staff - PieKiJa";

    const createEmptyRecordFromTemplate = () => {
        createRecord("00367cam a2200133La 4500001001200000005001700012008004100029020000900070100003300079245004400112300002800156500002800184700002100212000448147-X20020606090541.3860327s1985    fi a          000 0 fin d  aISBN1 aMeikalainen, Matti,eauthor.10aTitle /bsubtitle :cpossible creators.  a67 p. :bill. ;c23 cm.  aThis is a general note!1 aCreator, Another", history);
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
                const marc = MARC21.MARCXMLToMARC(response.data.records[0].fullRecord)
                console.log(marc);
                console.log(MARC21.stringify(marc));
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handlePreview = fullRecord => () => {
        const parsedMARC = MARC21.MARCXMLToMARC(fullRecord);
        console.log(parsedMARC);
        if (!parsedMARC) return console.log("no parsedMARC");
        createTemporaryRecord(MARC21.stringify(parsedMARC));
        history.push("/staff/record/preview");
    };

    return <AddressedTabs
        titles={[__("Welcome"), __("Records"), __("Locations"), __("Loantypes"), __("Users"), __("Circulation"), __("Notes"), __("Statistics")]}
        addresses={["", "records", "locations", "loantypes", "users", "circulation", "notes", "statistics"]}
        root="staff">
        <Tab>
            <p>{__("Welcome")}</p>
        </Tab>
        <Tab>
            <button onClick={createEmptyRecordFromTemplate}>{__("Create empty record from template")}</button>
            <button onClick={() => setShowScanner(!showScanner)}>{__("Add record by scanning EAN code")}</button>
            {showScanner && <Scanner />}

            <form onSubmit={handleSearchSubmit}>
                <input name="code" placeholder={__("ISBN or EAN")} />
                <button>{__("Search external databases for this record")}</button>
            </form>

            <table>
                <tbody>
                    {searchResult.resultCount && searchResult.records.map(r => <tr><td>{r.title}</td><td>{r.id}</td>
                        <td>
                            <a href={`//finna.fi/Record/${r.id}`} target="_blank">{__("View in Finna")}</a>
                            <button onClick={handlePreview(r.fullRecord)}>{__("Preview")}</button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
        </Tab>
        <Tab>
            <StaffLocations />
        </Tab>
        <Tab>
            <StaffLoantypes />
        </Tab>
        <Tab>
            <StaffUser />
        </Tab>
        <Tab>
            <Circulation history={history} />
        </Tab>
        <Tab>
            <StaffNotes />
        </Tab>
        <Tab>
            <StaffStatistics />
        </Tab>
    </AddressedTabs>
};

export default connect(
    state => ({
        isStaffUser: state.user ? state.user.staff : false,
        __: __(state)
    }),
    { createRecord, createTemporaryRecord }
)(Staff);