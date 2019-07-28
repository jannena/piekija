
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

module.exports = validateAdvancedQuery;