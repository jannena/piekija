const validateQuery = require("../utils/queryValidator");

describe("query validator can transform valid queries", () => {
    test("#1", () => {
        const query = [
            "and", [
                ["or", [
                    ["recordType", "custom"],
                    ["subjects", "kissat"],
                    ["and", [
                        ["authors", "Mikko"],
                        ["locations", "Mikkeli"]
                    ]]
                ]],
                ["locations", "Tanska"],
                ["persons", "Obel"]
            ]
        ];

        expect(validateQuery(query)).toEqual({
            $and: [
                {
                    $or: [
                        { recordType: "custom" },
                        { subjects: "kissat" },
                        {
                            $and: [
                                { authors: "Mikko" },
                                { locations: "Mikkeli" }
                            ]
                        }
                    ]
                },
                { locations: "Tanska" },
                { persons: "Obel" }
            ]
        });
    });

    test("#2", () => {
        const query = [
            "or", [
                ["and", [
                    ["or", [
                        ["and", [
                            ["or", [
                                ["and", [
                                    ["locations", "Suomi"],
                                    ["persons", "Matti"]
                                ]]
                            ]]
                        ]],
                        ["authors", "Joku"],
                        ["genres", "popmusiikki"],
                        ["languages", "eng"],
                        ["languages", "fin"]
                    ]]
                ]],
                ["title", "hei"],
                ["year", "2018"],
                ["record", "lumme"]
            ]
        ];

        expect(validateQuery(query)).toEqual({
            $or: [{
                $and: [{
                    $or: [{
                        $and: [{
                            $or: [
                                [{
                                    $and: [
                                        { locations: "Suomi" },
                                        { persons: "Matti" }
                                    ]
                                }]
                            ]
                        }]
                    },
                    { authors: "Joku" },
                    { genres: "popmusiikki" },
                    { languages: "eng" },
                    { languages: "fin" }
                ]
                }]
            },
            { title: "hei" },
            { year: "2018" },
            { record: "lumme" }]
        });
    });
});

describe("query validator cannot transform invalid queries", () => {
    test("there is invalid operator name in query", () => {

    });

    test("value of 'and' operator is not an 2d array", () => {

    });
});