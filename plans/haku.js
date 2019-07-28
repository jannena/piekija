

const haku = {
    and: {
        location: "Tanska",
        all: "Lumme",
        or: {
            author: "Obel",
            all: "sello"
        },
        not: {
            authors: "Matti"
        }
    }
};

const haku2 = [
    "and", [
        ["location", "Tanska"],
        ["author", "Obel"],
        ["or", [
            ["authors", "Matti"],
            ["all", "sello"]
        ]]
    ]
];

const haku3 = {
    "and": [
        ["Location", "Tanska"],
        ["or", [
            ["persons", "Muumipeikko"],
            ["authors", "Obel"]
        ]]
    ]
};