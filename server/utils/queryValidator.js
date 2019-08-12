
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
    const open = 1;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === "(") open++;
        if (string[i] === ")") open--;
        if (open === 0) return [string.substring(0, i), string.substring(i, i + 6), string.substring(i + 6)];
    }
};

const getFirstOpOutsideBrackets = string => {
    const open = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] === "(") open++;
        if (string[i] === ")") open--;
        if ([" AND ", " OR "].indexOf(string.substring(i, i + 6)) > -1 && open === 0)
            return [string.substring(0, i), string.substring(i, i + 6), string.substring(i + 6)];
    }
    return null;
};

const validateSimpleQuery = query => {
    if (query.split("(").length !== query.split(")").length) throw new Error("Eri määrä sulkuja!");
    let pair = getFirstOpOutsideBrackets(query);
    console.log(pair);
    if (!pair) pair = getUntilMatchingBracket(query.substring(1));
    return [
        pair[1],
        [
            ...validateSimpleQuery(pair[0]),
            ...validateSimpleQuery(pair[1])
        ]
    ];
};

module.exports = {
    validateAdvancedQuery,
    validateSimpleQuery
};