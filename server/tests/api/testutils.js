const { SECRET } = require("../../utils/config");
const User = require("../../models/User");
const Record = require("../../models/Record");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const initMARC21Data = [
    "02021cam a22005774i 45000010008000000030011000080050017000190080041000360200031000770350025001080350026001330400035001590410013001940420009002070800030002160840014002460840019002601000032002792400026003112450060003372640057003972640011004542640011004653000023004763360028004993370049005273380025005766000031006016500026006326500036006586500032006946500020007266500036007466550049007826550036008316550029008676550023008966550079009197000060009988520015010588520015010738520015010888520015011038520015011188520015011338520015011488520014011638520015011778560126011928560125013181706985ANDL10001320181011151338.4180223t20182018fi ||||g      |0| f fin    a978-951-0-42529-9qsidottu  a(FI-KV)9789510425299  a(FI-MELINDA)012207067  aFI-NLbfinerdadFI-BTJdFI-KM1 afinheng  afinb1 a820x-321974/fin/fennica  a84.22ykl9 aJännitys2ykl1 aTudor, C. J.,ekirjoittaja.14aThe chalk man,lsuomi10aLiitu-ukko /cC. J. Tudor ; suomentanut Raimo Salminen. 1aHelsinki :bWerner Söderström osakeyhtiö,c[2018] 3aEU:ssa 4c©2018  a426 sivua ;c23 cm  atekstibtxt2rdacontent  akäytettävissä ilman laitettabn2rdamedia  anidebnc2rdacarrier04aEddiec(fiktiivinen hahmo) 7asalaisuudet2kaunokki 7aviestitxpiirustukset2kaunokki 7adéjà vu -ilmiö2kaunokki 7amurha2kaunokki 7aaikatasoty1986y20162kaunokki 7apsykologinen jännityskirjallisuus2kaunokki 7ajännityskirjallisuus2kaunokki 7aesikoisteokset2kaunokki 7aromaanit2kaunokki 7akaunokirjallisuusxenglanninkielinen kirjallisuusxkäännökset2kaunokki1 aSalminen, Raimo,ekääntäjä.0(FI-ASTERI-N)000058058  a18b001c3  a18b003c3  a18b201c3  a19b401c3  a18b501c3  a10b601c3  a12b701c3  a9b801c3  a18b901c342qimage/jpeguhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=getimage&ISBN=9789510425299zKansikuva42qtext/htmluhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=showreferat&ISBN=9789510425299zKuvaus",
    "02470njm_a22006134i_45000010008000000030011000080050017000190070015000360080041000510240018000920280016001100350020001260350026001460400008001720410013001800840018001930840017002111100028002282450030002562460025002862460029003112600058003403000087003983360039004853370023005243380031005475000038005785050041006165110350006575960010010076500039010176500033010566500049010896500029011386500033011676500051012007000031012518520015012828520015012978520015013129790036013279790035013639790037013989790042014359790046014779790035015239790035015589790049015939790035016429790056016779790046017339790040017799790037018191247533ANDL10001320180613110936.0sd |||g|||m||d111129s2011    fi rc||__||||||__ | eng||3 a643004379002802aSCENECD-002  a(FI-BTJ)1652326  a(FI-MELINDA)007301531  bfin0 dengdfin  a78.891122ykl  a78.89112ykl2 aNightwish,eesittäjä.10aImaginaerum /cNightwish.33aImaginaerum original33aImaginaerum instrumental  a[Kustannuspaikka tuntematon] :bScene Nation,cp2011.  a2 CD-äänilevyä (74 min 56 s, 73 min 56 s) +etekstiliite (24 s.) + 2 julistetta  aesitetty musiikkibprm2rdacontent  aaudiobs2rdamedia  aäänilevybsd2rdacarrier  aLaulujen sanat tekstiliitteessä.0 aCD 1: Original ; CD 2: Instrumental.0 aNightwish: Anette Olzon (voc), Marco Hietala (b, voc), Emppu Vuorinen (g), Jukka Nevalainen (dr, perc), Tuomas Holopainen (keys, p) & The Metro Voices, The Young Musicians London, The Looking Glass Orchestra, Pekka Kuusisto (v), Troy Donockley (säkkipilli, low whistle, bodhran, buzuki), Dermot Crehan (hardangerviulu), Dirk Campbell (sorna)...  bLO506 7aheavy rockzSuomiy2010-luku2musa 7arockzSuomiy2010-luku2musa 7aprogressiivinen rockzSuomiy2010-luku2musa 7akuorotxheavy rock2musa 7aorkesteritxheavy rock2musa 7akelttiläinen kansanmusiikkixheavy rock2musa1 aShearman, James,ejohtaja.  a18b001c4  a19b401c4  a18b501c4  aanders.1261392bTaikatalvihfin  aanders.1261393bStorytimeheng  aanders.1261394bGhost riverheng  aanders.1261395bSlow, love, slowheng  aanders.1261396bI want my tears backheng  aanders.1261397bScaretaleheng  aanders.1261398bArabesqueheng  aanders.1261399bTurn loose the mermaidsheng  aanders.1261400bRest calmheng  aanders.1261401bThe crow, the owl and the doveheng  aanders.1261402bLast ride of the dayheng  aanders.1261403bSong of myselfheng  aanders.1261404bImaginaerumheng"
];

const addUserToDb = async (username, password, staff) => {
    const passwordHash = await bcrypt.hash(password, 13);
    const newUser = new User({
        username,
        passwordHash,
        name: "user",
        staff,
        barcode: "asd",
        shelves: [],
        loans: []
    });
    return await newUser.save();
};

const addRecordToDb = async () => {
    const newRecord = new Record({
        timeAdded: new Date(),
        timeModified: new Date(),
        title: "A New Book",
        description: "",
        image: "",
        contentType: "a",
        year: 2019,
        author: "Virtanen, Juhani,",
        authors: [
            "Virtanen, Juhani,",
            "Virtanen, Maria,"
        ],
        genres: [
            "fantasiakirjallisuus",
            "tietieskirjallisuus"
        ],
        subjects: [
            "maailma",
            "Eurooppa",
            "ruoho",
            "puutarha"
        ],
        language: "fin",
        languages: [
            "fin",
            "eng"
        ],
        links: [],
        recordType: "marc21",
        record: "",
        items: []
    });
    const savedRecord = await newRecord.save();
    return savedRecord._id;
};

const getTokenForUser = user => {
    const tokenData = {
        id: user._id,
        username: user.username,
        name: user.name
    };
    return jwt.sign(tokenData, SECRET);
};

const clearDatabase = async () => {
    await Record.deleteMany({});
    await User.deleteMany({});
};

const usersInDb = async () => (await User.find({})).length;
const recordsInDb = async () => (await Record.find({})).length;

module.exports = {
    addUserToDb,
    addRecordToDb,
    clearDatabase,
    getTokenForUser,
    initMARC21Data,
    usersInDb,
    recordsInDb
};