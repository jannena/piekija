
const changeAndAndOrIfNeeded = operator => ["AND", "OR"].indexOf(operator) === -1 ? operator : `$${operator.toLowerCase()}`;
const isValidOperator = operator =>
    [
        "AND", "OR", "NOT",
        "title", "author", "authors", "language", "languages", "year", "contentType",
        "series", "classification", "standardCodes", "country",
        "subjects", "genres",
        "spelling1", "spelling2"
    ].indexOf(operator) !== -1;

const validateAdvancedQuery = ([operator, value, type]) => {
    if (!isValidOperator(operator)) throw new Error(`Operator ${operator} is invalid.`);

    let validatedQuery = {};

    const newOperator = changeAndAndOrIfNeeded(operator);

    if (Array.isArray(value)) validatedQuery[newOperator] = value.map(query => validateAdvancedQuery(query));
    else {
        if (!type) throw new Error(`Operator ${operator} needs a type.`);
        switch (type) {
            case "not":
                validatedQuery[newOperator] = { $ne: value };
                break;
            case "lt":
                validatedQuery[newOperator] = {
                    $lt: Number(value)
                };
                break;
            case "gt":
                validatedQuery[newOperator] = {
                    $gt: Number(value)
                };
                break;
            case "is":
            default:
                validatedQuery[newOperator] = value;
                break;
        }
    }

    // TODO: This does not work if we are searching for two values in same array
    /* if (operator === "AND") {
        let combined = {};
        validatedQuery[newOperator].forEach(o => combined = { ...combined, ...o });
        validatedQuery = combined;
    } */

    return validatedQuery;
};

const getUntilMatchingBracket = string => {
    let open = 1;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === "(") open++;
        if (string[i] === ")") open--;
        if (open === 0) return string.substring(0, i);
    }
};

const getFirstOpOutsideBrackets = string => {
    let open = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === "(") open++;
        if (string[i] === ")") open--;
        const nextSix = string.substring(i, i + 5);
        const nextFive = nextSix.substring(0, 4);
        if (nextSix === " AND " && open === 0)
            return [string.substring(0, i), string.substring(i + 1, i + 4), string.substring(i + 5)];
        if (nextFive === " OR " && open === 0)
            return [string.substring(0, i), string.substring(i + 1, i + 3), string.substring(i + 4)];
    }
    return null;
};

const queryContainsOps = query => [" AND ", " OR "].some(op => query.includes(op));

const validateSimpleQueryRecursion = query => {
    const start = 5;
    if (query.split("(").length !== query.split(")").length) throw new Error("Eri määrä sulkuja!");
    let pair = getFirstOpOutsideBrackets(query);
    console.log(pair);
    while (query.substring(0, 2) === "((" && query.substring(query.length - 2) === "))")
        query = query.substring(1, query.length - 1);
    if (!pair && query[0] === "(") pair = getFirstOpOutsideBrackets(getUntilMatchingBracket(query.substring(1)));
    return [
        pair[1],
        [
            (queryContainsOps(pair[0]) ? validateSimpleQuery(pair[0]) : ["spelling1", pair[0].toLowerCase(), "is"]),
            (queryContainsOps(pair[2]) ? validateSimpleQuery(pair[2]) : ["spelling1", pair[2].toLowerCase(), "is"])
        ]
    ];
};

const simplifySimpleQuery = query => {
    if (Array.isArray(query[1])) {
        const ret = [...query];
        ret[1] = [];
        for (let i = 0; i < query[1].length; i++) {
            if (!Array.isArray(query[1][i][1])) {
                ret[1].push(query[1][i]);
                continue;
            }
            if (query[1][i][0] === query[0]) {
                ret[1].push(...simplifySimpleQuery(query[1][i][1]));
            }
            else {
                ret[1].push(query[1][i]);
            }
        }
        /* for (let i = 0; i < query[1].length; i++) {
            if (Array.isArray(query[0][i])) 
        } */
        return ret;
    }
    return query;
};

const parseRequestNotContainingOps = query => {
    const subquery = [];

    const allwords = [];
    query.toLowerCase().split(" ").map(w => {
        if (w[0] === "+") {
            subquery.push({
                $or: [

                    { "spelling1": w.substring(1) },
                    { "spelling2": w.substring(1) },
                ]
            });
            allwords.push(w.substring(1));
        }
        else if (w[0] === "-") {
            subquery.push({
                $and: [
                    { "spelling1": { $ne: w.substring(1) } },
                    { "spelling2": { $ne: w.substring(1) } },
                ]
            });
            // allwords.push(w.substring(1));
        }
        else allwords.push(w);
    });

    const query2 = {
        $and: [
            {
                $or:
                    [
                        ...allwords.map(w => ({ spelling1: w })),
                        ...allwords.map(w => ({ spelling2: w }))
                        /* { "spelling1": { "$in": allwords } },
                        { "spelling2": { "$in": allwords } } */
                    ]
            }
        ]
    };
    if (subquery.length > 0) query2.$and.push(...subquery);

    return query2;
};

// TODO: fix parsing queries containing extra brackets
const validateSimpleQuery = query => {
    // const query = q.toLowerCase();
    console.log("what is query?", query);
    try {
        if (!queryContainsOps(query)) return parseRequestNotContainingOps(query) /* return [
            "AND",
            query.split(" ").map(q => (["spelling1", q.toLowerCase(), "is"]))
        ]; */
        return simplifySimpleQuery(validateSimpleQueryRecursion(query));
    }
    catch (err) {
        console.log(err);
        return ["AND", [
            ["spelling1", query.toLowerCase(), "is"]
        ]];
    }
};

// const result123 = validateSimpleQuery("(moi AND hei AND terve AND moikku) OR (terkut OR heippa OR moiksu OR joojoo)")
// const result123 = validateSimpleQuery("(Seita AND Parkkola) OR Nightwish");
// console.log(JSON.stringify(result123));

module.exports = {
    validateAdvancedQuery,
    validateSimpleQuery,
    queryContainsOps
};