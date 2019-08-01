## User
- name: String
- username: String
- passwordHash: String
- barcode: String
- loans: {
    item: Item
    dueDate: Date
}[]
- shelves: Shelf[]

## Shelf
- name: String
- author: User
- sharedWith: User[]
- public: Boolean
- items: {
    book: Item,
    note: String
}[]

## Record
- timeAdded: Date
- timeModified: Date
- title: String
- description: String
- image: String (url of the image)
- ?ISBN: String
- contentType: String
- year: String
- ?classification: String[]
- author: String ("headauthor")
- authors: String[] (other authors)
- genres: String[]
- subjects: String[]
- languages: String[]
- links: String[]
- recordType: String (marc21 / custom)
- record: String
- items: Item[]

## Item
- id: String
- record: Record
- location: Location
- loanType: LoanType
- ratings: {
    comment: String,
    author: User
}[]
- state: String (ei käytettävissä / hankinnassa / lainassa / käytettävissä / rikki / ...)
- stateInfo: {
    personInCharge: User (loaner, breaker, ...)
    dueDate: Date
}

## Location
- name: String

## LoanType
- name: String
- canBePlacedAHold: Boolean
- canBeLoaned: Boolean
- canBeRenewed: Boolean
- renewTimes: Int
- loanTime: Int (days)