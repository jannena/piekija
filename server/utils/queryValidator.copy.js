
const changeAndAndOrIfNeeded = operator => ["and", "or"].indexOf(operator) === -1 ? operator : `$${operator}`;
const isValidOperator = operator =>
    [
        "and", "or", /* "not", */
        "title", "author", "authors", "language", "languages", "year", "contentType",
        "locations", "subjects", "persons", "genres",
        "description", "recordType", "record"
    ].indexOf(operator) !== -1;

// TODO: 

const validateAdvancedQuery = ([operator, value, type]) => {
    if (!isValidOperator(operator)) throw new Error(`Operator ${operator} is invalid.`);

    let validatedQuery = {};

    const newOperator = changeAndAndOrIfNeeded(operator);

    if (Array.isArray(value)) validatedQuery[newOperator] = value.map(query => validateAdvancedQuery(query));
    else {
        if (!type) throw new Error(`Operator ${operator} needs a type.`);
        switch (type) {
            case "contains":
                validatedQuery[newOperator] = {
                    $regex: value,
                    $options: "i"
                }
                break;
            case "is":
            default:
                validatedQuery[newOperator] = value;
                break;
        }
    }

    if (operator === "and") {
        let combined = {};
        validatedQuery[newOperator].forEach(o => combined = { ...combined, ...o });
        validatedQuery = combined;
    }

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

const validateSimpleQuery = (query, lastOp) => {
    if (query.split("(").length !== query.split(")").length) throw new Error("Eri määrä sulkuja!");
    let pair = getFirstOpOutsideBrackets(query);
    console.log(pair);
    if (!pair && query[0] === "(") pair = getFirstOpOutsideBrackets(getUntilMatchingBracket(query.substring(1)));
    if (pair[1] === lastOp) return [
        "same",
        [
            (queryContainsOps(pair[0]) ? validateSimpleQuery(pair[0], pair[1]) : [pair[0]]),
            (queryContainsOps(pair[2]) ? validateSimpleQuery(pair[2], pair[1]) : [pair[2]])
        ]
    ];

    const first = queryContainsOps(pair[0]) ? validateSimpleQuery(pair[0], pair[1] === "same" ? lastOp : pair[1]) : [pair[0]];
    const second = queryContainsOps(pair[2]) ? validateSimpleQuery(pair[2], pair[1] === "same" ? lastOp : pair[1]) : [pair[2]]

    let ret = [];

    if (first[0] === "same") ret = ret.concat(first[1]);
    if (second[0] === "same") ret = ret.concat(second[1]);

    return [
        pair[1],
        [
            ...ret
        ]
    ];
};

// console.log(validateSimpleQuery("(moi AND hei AND terve AND moikku) OR (terkut OR heippa OR moiksu OR joojoo)"));
console.log(validateSimpleQuery("moi AND hei AND terve"));

module.exports = {
    validateAdvancedQuery,
    validateSimpleQuery
};