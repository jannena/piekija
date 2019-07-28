

/* const validateAdvancedQuery = query => {
    const validatedQuery = {};
    query.forEach(([operator, value], i) => {
        console.log(operator, value);
        if (Array.isArray(value)) validatedQuery[operator] = validateAdvancedQuery(value);
        else validatedQuery[operator] = value;
    });
    return validatedQuery;
}; */

const changeAndAndOrIfNeeded = operator => ["and", "or"].indexOf(operator) === -1 ? operator : `$${operator}`;
const isValidOperator = operator =>
    [
        "and", "or", /* "not", */
        "title", "author", "authors", "language", "languages", "year", "contentType",
        "locations", "subjects", "persons", "genres",
        "description", "recordType", "record"
    ].indexOf(operator) !== -1;

const validateAdvancedQuery = ([operator, value]) => {
    if (!isValidOperator(operator)) return null;

    const validatedQuery = {};

    const newOperator = changeAndAndOrIfNeeded(operator);

    if (Array.isArray(value)) validatedQuery[newOperator] = value.map(query => validateAdvancedQuery(query));
    else validatedQuery[newOperator] = value;

    return validatedQuery;
};

module.exports = validateAdvancedQuery;