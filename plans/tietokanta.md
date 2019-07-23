## User
- name: String
- username: String
- passwordHash: String
- card: String

## Shelf
- author: User
- public: Boolean
- books: {
    book: Book,
    note: String
}[]

## Record
- timeAdded: Date
- timeModified: Date
- title: String
- ISBN: String
- type: String
- year: String
- classification: String
- locations: String[]
- authors: String[]
- genres: String[]
- subjects: String[]
- languages: String[]
- links: String[]
- type: String (marc21 / custom)
- record: String

## Item
- id: String
- record: Record
- location: Location
- state: String (ei käytettävissä / lainassa / käytettävissä / rikki / ...)

## Location
- name: String