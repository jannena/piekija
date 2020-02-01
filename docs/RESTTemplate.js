import React from "react";

const toLink = l => l.replace(/\//g, "-").replace(/ /g, "").replace(/:/g, "_");

const RESTTemplate = ({ verb, address, description, parameters, privileges, errors, returns }) => {
    const params = () => {
        if (!parameters.length) return null;
        else return <div>
            <h3>Parameters</h3>
            <table style={{ width: "100%" }}>
                <tbody>
                    {parameters.map(p => <tr key={p[0]}>
                        <td>{`${p[0]}${p[2] ? "*" : ""}`}</td>
                        <td>{p[1]}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>;
    };

    const errs = () => {
        if (!errors.length) return null;
        else return <div>
            <h3>Possible errors</h3>
            <ul>
                {errors.map(e => <li key={e}>{e}</li>)}
            </ul>
        </div>;
    };

    const id = toLink(`${verb} ${address}`);

    return (<>
        <div style={{ padding: "20px 0px" }} id={id}>
            <div style={{ padding: "7px 0px" }}><a href="#toc">Top</a></div>
            <div style={{ fontSize: "1.1em" }}>
                <span style={{ background: "lightgrey", padding: 5, fontWeight: "bold" }}>{verb}</span>
                <span>{address}</span>
            </div>
            <div>Privileges: {["No need to log in", "all logged users", "only staff users", "the owner of the shelf", "user shelf has been shared with"][privileges || 0]}</div>
            <div>{description}</div>
            {returns && <div>
                <h3>Returns</h3>
                <div><pre>{returns}</pre></div>
            </div>}
            {params()}
            {errs()}
        </div><hr /></>);
};

export default RESTTemplate;

const tableOfContents = [
    [
        "Login",
        "POST /api/login"
    ],

    [
        "Search",
        "POST /api/search/simple",
        "POST /api/search/advanced"
    ],

    [
        "Records",
        "GET /api/record/:id",
        "POST /api/record",
        "PUT /api/record/:id",
        "DELETE /api/record/:id"
    ],

    [
        "Items",
        "POST /api/item",
        "PUT /api/item/:id",
        "DELETE /api/item/:id",
        "POST /api/item/search",
    ],

    [
        "Loantypes",
        "GET /api/loantype",
        "POST /api/loantype",
        "PUT /api/loantype/:id",
        "DELETE /api/loantype/:id"
    ],

    [
        "Notes",
        "GET /api/note",
        "GET /api/note/last",
        "POST /api/note",
        "PUT /api/note/:id",
        "DELETE /api/note/:id"
    ],

    [
        "Locations",
        "GET /api/location",
        "POST /api/location",
        "PUT /api/location/:id",
        "DELETE /api/location/:id"
    ],

    [
        "Users (rest)",
        "GET /api/user/:id",
        "POST /api/user",
        "PUT /api/user/:id",
        "DELETE /api/user/:id",
        "POST /api/user/search",
    ],

    [
        "Shelves",
        "POST /api/shelf",
        "GET /api/shelf/:id",
        "PUT /api/shelf/:id",
        "DELETE /api/shelf/:id",
        "POST /api/shelf/:id/shelve",
        "DELETE /api/shelf/:id/shelve",
        "PUT /api/shelf/:id/shelve",
        "POST /api/shelf/:id/share",
        "DELETE /api/shelf/:id/share",
    ],

    [
        "Users (me)",
        "POST /api/user/me",
        "PUT /api/user/me",
    ],

    [
        "Statistics",
        "POST /api/statistics/total",
        "POST /api/statistics/totalLoans",
        "POST /api/statistics/notLoanedSince"
    ],

    [
        "Circulation",
        "POST /api/circulation/loan",
        "POST /api/circulation/return",
        "POST /api/circulation/renew",
    ]
];

export const TableOfContents = () => {
    return <ul id="toc">
        {tableOfContents.map(r => <li>
            <div>{r[0]}</div>
            <ul>
                {r.slice(1).map(t => <li><a href={`#${toLink(t)}`}>{t}</a></li>)}
            </ul>
        </li>)}
    </ul>;
};