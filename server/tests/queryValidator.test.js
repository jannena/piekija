const { validateAdvancedQuery, validateSimpleQuery } = require("../utils/queryValidator");

describe("simple query validator tests", () => {
    describe("query validator can transform valid queries", () => {
        test("#1", () => {
            expect(validateSimpleQuery("((kissa OR koira) AND poni) OR ((hevonen AND (kani OR tamma)) OR ruuna)"))
                .toEqual([
                    "OR", [
                        ["AND", [
                            ["OR", [
                                ["kissa"],
                                ["koira"]
                            ]],
                            ["poni"]
                        ]],
                        ["OR", [
                            ["AND", [
                                ["hevonen"],
                                ["OR", [
                                    ["kani"],
                                    ["tamma"]
                                ]]
                            ]],
                            ["ruuna"]
                        ]]
                    ]
                ])
        });

        test("#2", () => {
            expect(validateSimpleQuery("(moi AND hei AND terve AND moikku) OR (terkut OR heippa OR moiksu OR joojoo)"))
                .toEqual([
                    "OR",
                    ["AND", [
                        ["moi"],
                        ["hei"],
                        ["terve"],
                        ["moikku"]
                    ]],
                    ["terkut"],
                    ["heippa"],
                    ["moiksu"],
                    ["joojoo"]
                ]);

        });
    });
});

describe("advanced query validator tests", () => {
    describe("query validator can transform valid queries", () => {
        test("#1", () => {
            const query = [
                "and", [
                    ["or", [
                        ["recordType", "custom", "is"],
                        ["subjects", "kissat", "is"],
                        ["and", [
                            ["authors", "Mikko", "contains"],
                            ["locations", "Mikkeli", "is"]
                        ]]
                    ]],
                    ["locations", "Tanska", "is"],
                    ["persons", "Obel", "contains"]
                ]
            ];

            expect(validateAdvancedQuery(query)).toEqual(
                {
                    $or: [
                        { recordType: "custom" },
                        { subjects: "kissat" },
                        {
                            authors: {
                                $regex: "Mikko",
                                $options: "i"
                            },
                            locations: "Mikkeli"
                        }
                    ],
                    locations: "Tanska",
                    persons: {
                        $regex: "Obel",
                        $options: "i"
                    }
                }
            );
        });

        test("#2", () => {
            const query = [
                "or", [
                    [
                        "and", [
                            ["or", [
                                ["persons", "Mikko", "is"],
                                ["and", [
                                    ["language", "swe", "contains"],
                                    ["languages", "spa", "is"]
                                ]]
                            ]],
                            ["authors", "Joku", "is"],
                            ["genres", "popmusiikki", "is"],
                            ["languages", "eng", "is"]
                        ]
                    ],
                    ["title", "hei", "contains"],
                    ["year", "2018", "is"],
                    ["record", "lumme", "is"]
                ]
            ];

            expect(validateAdvancedQuery(query)).toEqual({
                $or: [
                    {
                        $or: [
                            { persons: "Mikko" },
                            {
                                language: {
                                    $regex: "swe",
                                    $options: "i"
                                },
                                languages: "spa"
                            }
                        ],
                        authors: "Joku",
                        genres: "popmusiikki",
                        languages: "eng"
                    },
                    {
                        title: {
                            $regex: "hei",
                            $options: "i"
                        }
                    },
                    {
                        year: "2018"
                    },
                    {
                        record: "lumme"
                    }
                ]
            });
        });
    });

    describe("query validator cannot transform invalid queries", () => {
        test("there is invalid operator name in query", () => {
            const query = ["and", [
                ["name", "moi", "is"]
            ]]
            expect(validateAdvancedQuery.bind(this, query)).toThrow("Operator name is invalid");
        });

        test("value of 'and' operator is not an 2d array", () => {
            const query = ["and", [
                "title", "otsikko"
            ]];
            expect(validateAdvancedQuery.bind(this, query)).toThrow();
        });
    });
});