
export default (slog, def) => {
    return {
        // Essentials
        "cancel-button": "Peruuta",
        "save-button": "Tallenna",
        "edit-button": "Muokkaa",
        "delete-button": "Poista",
        "remove-button": "Poista",
        "search-button": "Hae",
        "clear-button": "Tyhjennä",
        "renew-button": "Uusi",
        "return-button": "Palauta",
        "create-button": "Luo",

        // item states
        "not loaned": "Ei lainassa",
        "loaned": "Lainassa",
        "not in use": "Ei käytössä",
        "broken": "Rikki",
        "placed a hold": "Varattu",
        "other": "Muu",

        // Content types
        "a": "Tekstiaineisto",
        "c": "Nuottijulkaisu",
        "d": "Nuottikäsikirjoitus",
        "e": "Kartta-aineisto",
        "f": "Karttakäsikirjoitus",
        "g": "Heijastettava kuva tai viestin",
        "i": "Puheäänite",
        "j": "Musiikkiäänite",
        "k": "Kuva",
        "m": "Elektroninen aineisto",
        "o": "Moniviestin",
        "p": "Sekalainen aineisto",
        "r": "Esine",
        "t": "Tekstikäsikirjoitus",

        // Search.js
        "Error": "Virhe",
        "Givethesearchquery": "Give the search query",
        "sortbyyear": "Vuosi (uusin ensin)",
        "sortbyyeardesc": "Vuosi (vanhin ensin)",
        "sortbyalphapetical": "Aakkosjärjestys (A-Ö)",
        "sortbyalphapeticaldesc": "Aakkosjärjestys (Ö-A)",
        "sortbytimeadded": "Viimeksi lisätty ensin",
        "Previous": "Edellinen",
        "Next": "Seuraava",
        "Page": "Sivu",
        "No results": "Ei tuloksia",
        "Found": "Löydetty",
        "records-in": "tietuetta",
        "in-before-milliseconds": "",
        "in-milliseconds": "millisekuntissa",

        // AdvancedSearch.js
        "advancedsearch": "Tarkennettu haku",
        "AddGROUP": "Lisää RYHMÄ",
        "AddFIELD": "Lisää KENTTÄ",
        "removethisgroup": "Poista tämä ryhmä",
        "withallthese(and)": "Kaikillä näillä (and)",
        "withanyofthese(or)": "Millä tahansa näistä (or)",
        "is exactly": "on täsmälleen",
        "is not": "ei ole",
        "is greater than": "on suurempi kuin",
        "is less than": "on pienempi kuin",
        "everything": "kaikki",
        "content type": "aineistolaji",
        "title": "otsikko",
        "subject": "aihe",
        "genre": "lajityyppi / genre",
        "author": "tekijä",
        "year": "vuosi",
        "country": "valmistusmaa",
        "standard code (ISBN/ISSN/...)": "Standardikoodi (ISBN/ISSN/...)",
        "series": "sarja",
        "classification": "luokitus",
        "main language": "pääkieli",
        "language": "kieli",

        // Container.js
        "Frontpage": "Etusivu",
        "Search-menu": "Haku",
        "Search-button": "Hae",
        "Help": "Ohjeet",

        // FrontpageNews.js
        "Created on": "Julkaistu",
        "Updated on": "Päivitetty viimeksi",

        // Login.js
        "Username": "Käyttäjätunnus",
        "Pasword": "Salasana",
        "Log in -button": "Kirjaudu sisään",
        "Two-factor authentication code": "Kaksivaiheisen tunnistautumisen koodi",

        // UserMenu.js
        "Log in": "Kirjaudu sisään",
        "You": "Tilisi",
        "Staff": "Henkilökunta",
        "Logout": "Kirjaudu ulos",

        // Record.js
        "Back": "Takaisin",
        "Content type": "Aineistolaji",
        "Series": "Sarja",
        "Appearance": "Ulkoasu",
        "spelling": "hakusanat",
        "Items": "Nimikkeet",
        "MARC": "MARC",
        "Links": "Linkit",

        // RecordTools.js
        "Add to shelf": "Lisää hyllyyn",
        "Edit record": "Muokkaa tietuetta",

        // RecordAuthors.js
        "Authors": "Tekijät",

        // RecordSubjects.js
        "Subjects": "Aiheet",

        // RecordClassification.js
        "Classification": "Luokitus",

        // RecordNotes.js
        "General note": "Yleinen huomautus",
        "Contents": "Sisältö",
        "Incomplete contents": "Epätäydellinen sisältö",
        "Partial contents": "Osittainen sisältö",
        "Summary": "Tiivistelmä",
        "Subject": "Aihe",
        "Review": "Arvostelu",
        "Scope and content": "Laajuus tai sisältö",
        "Abstract": "Abstrakti",
        "Content advice": "Varoitus",
        "Other note (not named yet)": "Muu huomautus",

        // RecordPublisherInfo.js
        "Production": "Tuottaminen",
        "Publication": "Kustantaminen",
        "Distribution": "Jakelu",
        "Manufacture": "Valmistaminen",
        "Copyright notice data": "Tekijänoikeusvuosi",
        "Publisher": "Julkaisutiedot",

        // RecordStandardCodes.j
        "Standard codes": "Standardikoodit",
        "NO TYPE": "EI TYYPPIÄ",

        // RecordTime.js
        "Currently published": "Ilmestyy edelleen",
        "Ceased publishing": "Lakannut ilmestymästä",
        "Detailed date": "Tarkka päivämäärä",
        "Dates unknown": "Tuntematon julkaisuaika",
        "Questionable data": "Epävarma julkaisuaika",
        "BC": "eKr.",

        // RecordLanguages.js
        "Countries": "Valmistusmaat",
        "Main language": "Ensisijainen kieli",
        "Text language": "Tekstin kieli",
        "Language of summary or abstract": "Tiivistelmän tai abstraktin kieli",
        "Sung or spoken text language": "Laulettu tai puhuttu kieli",
        "Language of table of contents": "Sisällysluettelon kieli",
        "Original language": "Alkuperäinen kieli",
        "Subtitles language": "Tekstitysten kieli",
        "Intermediate translation languages": "Välikäännösten kieli",

        // Shelf.js
        "Public shelf": "Julkinen hylly",
        "you": "sinä",
        "Description": "Kuvaus",
        "Author": "Tekijä",
        "records-shelves": "Tietueet",
        "Share with": "Jaa",

        // ShelfRecord.js
        "Record does not exist": "Tietuetta ei ole olemassa",

        // ShelfSharing.js
        "share-button": "Jaa",
        "unshare-button": "Lopeta jakaminen",
        "Shared with": "Jaa",
        "Share with...": "Jaa...",

        // TFAForm.js
        "scan-qr-code-info": "Skannaa QR-koodi Google Authenticator -sovelluksella tai muulla tunnistautumissovelluksella",
        "Current password": "Nykyinen salasana",
        "Enabled": "Käytössä",
        "Disabled": "Poistettu käytöstä",
        "Enable": "Ota käyttöön",
        "Disable": "Poista käytöstä",

        // UserInfo.js
        "Loans": "Lainat",
        "Shelves": "Hyllyt",
        "Holds": "Varaukset",
        "Edit me": "Muokkaa tietoja",
        "Two-factor authentication": "Kaksivaiheinen tunnistautuminen",
        "My shelves": "Hyllyni",
        "Shared with me": "Jaettu kanssani",
        "Create shelf": "Luo hylly",
        "Name": "Nimi",
        "New password": "Uusi salasana",
        "New password again": "Uusi salasana uudelleen",
        "Old password": "Vanha salasana",
        "new-password-info": "Jätä tyhjäksi, jos et halua vaihtaa salasanaa.",

        // Staff.js
        "Forbidden!": "Pääsy kielletty!",
        "Welcome": "Tervetuloa",
        "Records": "Tietueet",
        "Locations": "Sijainnit",
        "Loantypes": "Lainausasetus",
        "Users": "Käyttäjät",
        "Circulation": "Lainaa ja palauta",
        "Notes": "Etusivu-uutiset",
        "Create empty record from template": "Luo tyhjä tietue mallista",
        "Add record by scanning EAN code": "Lisää tietue skannaamalla EAN-koodi",
        "ISBN or EAN": "ISBN tai EAN",
        "Search external databases for this record": "Hae tietuetta ulkoisista tietokannoista",
        "View in Finna": "Tarkastele Finnassa",
        "Preview": "Esikatsele",

        // Circulation.js
        "User barcode": "Käyttäjän viivakoodi",
        "Barcode": "Viivakoodi",
        "Name": "Nimi",
        "after-number-loans": "lainaa",
        "Show user": "Näytä käyttäjä",
        "Item barcode": "Aineiston viivakoodi",
        "Title": "Otsikko",
        "Location": "Sijainti",
        "Loantype": "Lainausasetus",
        "State": "Tila",
        "Show record": "Näytä tietue",
        "Loan item to": "Lainaa käyttäjälle",

        // Loan.js
        "Renew times left": "Uusimiskertoja jäljellä",
        "Due date": "Eräpäivä",

        // MARCEditor.js
        "Fields in this record": "Tämän tietueen kentät",
        "Add field": "Lisää kenttä",
        "back-to-top": "Ylös",
        "Save for preview": "Tallenna esikatselua varten",
        "Add subfield": "Lisää osakenttä",
        "Remove field": "Poista kenttä",

        // RecordItems.js
        "staff-item-barcode-info": "Yksilöllinen koodi jokaiselle aineistolle",
        "Create new item": "Luo uusi aineisto",

        // StaffEditRecord.js
        "Save to database": "Tallenna tietokantaan",
        "watching-preview-info": "Tarkastelet tietuetta esikatselutilassa. Tietuetta ei ole vielä tallennettu tietokantaan.",
        "cannot-remove-items-info": "Kaikki tähän tietueeseen liitetyt nimikkeet on poistettava ennen kuin tietue voidaan poistaa.",
        "Remove this record": "Poista tietue",
        "items-tab": "Nimikkeet",
        "preview-tab": "Preview",
        "simple-editor-tab": "Yksinkertainen muokkain",
        "remove-tab": "Poista",
        "MARC-tab": "MARC",

        // StaffUser.js
        "Create new user": "Lisää uusi käyttäjä",

        // StaffNotes.js
        "Create new note": "Lisää uusi etusivu-uutinen",
        "Title": "Otsikko",
        "Content": "Sisältö",

        // StaffLocations.js
        "Create new location": "Lisää uusi sijainti",
        "Location name": "Sijainnin nimi",
        "location-name-info": "Näkyy kaikille käyttäjille",

        // StaffLoantypes.js
        "Create new loantype": "Lisää uusi lainausasetus",
        "canBePlacedAHold": "Voi varata",
        "canBeLoaned": "Voi lainata",
        "renewTimes": "Uusimiskertojen määrä",
        "loanTime": "Laina-aika",
        "canBeLoaned-info": "Jos tässä on rasti, tätä nimikettä ei voi lainata.",
        "renewTimes-info": "Kuinka monta kertaa nimike voidaan uusia. Ei voi uusia, jos arvo on 0.",
        "loanTime-info": "Kuinka monta päivää laina-aika on"
    }[slog] || def || slog;
};