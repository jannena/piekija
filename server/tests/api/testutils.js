const { SECRET } = require("../../utils/config");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const initMARC21Data = [
    "02021cam a22005774i 45000010008000000030011000080050017000190080041000360200031000770350025001080350026001330400035001590410013001940420009002070800030002160840014002460840019002601000032002792400026003112450060003372640057003972640011004542640011004653000023004763360028004993370049005273380025005766000031006016500026006326500036006586500032006946500020007266500036007466550049007826550036008316550029008676550023008966550079009197000060009988520015010588520015010738520015010888520015011038520015011188520015011338520015011488520014011638520015011778560126011928560125013181706985ANDL10001320181011151338.4180223t20182018fi ||||g      |0| f fin    a978-951-0-42529-9qsidottu  a(FI-KV)9789510425299  a(FI-MELINDA)012207067  aFI-NLbfinerdadFI-BTJdFI-KM1 afinheng  afinb1 a820x-321974/fin/fennica  a84.22ykl9 aJännitys2ykl1 aTudor, C. J.,ekirjoittaja.14aThe chalk man,lsuomi10aLiitu-ukko /cC. J. Tudor ; suomentanut Raimo Salminen. 1aHelsinki :bWerner Söderström osakeyhtiö,c[2018] 3aEU:ssa 4c©2018  a426 sivua ;c23 cm  atekstibtxt2rdacontent  akäytettävissä ilman laitettabn2rdamedia  anidebnc2rdacarrier04aEddiec(fiktiivinen hahmo) 7asalaisuudet2kaunokki 7aviestitxpiirustukset2kaunokki 7adéjà vu -ilmiö2kaunokki 7amurha2kaunokki 7aaikatasoty1986y20162kaunokki 7apsykologinen jännityskirjallisuus2kaunokki 7ajännityskirjallisuus2kaunokki 7aesikoisteokset2kaunokki 7aromaanit2kaunokki 7akaunokirjallisuusxenglanninkielinen kirjallisuusxkäännökset2kaunokki1 aSalminen, Raimo,ekääntäjä.0(FI-ASTERI-N)000058058  a18b001c3  a18b003c3  a18b201c3  a19b401c3  a18b501c3  a10b601c3  a12b701c3  a9b801c3  a18b901c342qimage/jpeguhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=getimage&ISBN=9789510425299zKansikuva42qtext/htmluhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=showreferat&ISBN=9789510425299zKuvaus"
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

const getTokenForUser = user => {
    const tokenData = {
        id: user._id,
        username: user.username,
        name: user.name
    };
    return jwt.sign(tokenData, SECRET);
};

const clearDatabase = async () => {
    await User.deleteMany({});
}

module.exports = {
    addUserToDb,
    clearDatabase,
    getTokenForUser,
    initMARC21Data
};