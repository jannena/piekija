const { SECRET } = require("../../utils/config");
const User = require("../../models/User");
const Record = require("../../models/Record");
const Location = require("../../models/Location");
const Shelf = require("../../models/Shelf");
const Item = require("../../models/Item");
const Loantype = require("../../models/Loantype");
const Note = require("../../models/Note");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otp = require("speakeasy");

const initMARC21Data = [
    "02021cam a22005774i 45000010008000000030011000080050017000190080041000360200031000770350025001080350026001330400035001590410013001940420009002070800030002160840014002460840019002601000032002792400026003112450060003372640057003972640011004542640011004653000023004763360028004993370049005273380025005766000031006016500026006326500036006586500032006946500020007266500036007466550049007826550036008316550029008676550023008966550079009197000060009988520015010588520015010738520015010888520015011038520015011188520015011338520015011488520014011638520015011778560126011928560125013181706985ANDL10001320181011151338.4180223t20182018fi ||||g      |0| f fin    a978-951-0-42529-9qsidottu  a(FI-KV)9789510425299  a(FI-MELINDA)012207067  aFI-NLbfinerdadFI-BTJdFI-KM1 afinheng  afinb1 a820x-321974/fin/fennica  a84.22ykl9 aJännitys2ykl1 aTudor, C. J.,ekirjoittaja.14aThe chalk man,lsuomi10aLiitu-ukko /cC. J. Tudor ; suomentanut Raimo Salminen. 1aHelsinki :bWerner Söderström osakeyhtiö,c[2018] 3aEU:ssa 4c©2018  a426 sivua ;c23 cm  atekstibtxt2rdacontent  akäytettävissä ilman laitettabn2rdamedia  anidebnc2rdacarrier04aEddiec(fiktiivinen hahmo) 7asalaisuudet2kaunokki 7aviestitxpiirustukset2kaunokki 7adéjà vu -ilmiö2kaunokki 7amurha2kaunokki 7aaikatasoty1986y20162kaunokki 7apsykologinen jännityskirjallisuus2kaunokki 7ajännityskirjallisuus2kaunokki 7aesikoisteokset2kaunokki 7aromaanit2kaunokki 7akaunokirjallisuusxenglanninkielinen kirjallisuusxkäännökset2kaunokki1 aSalminen, Raimo,ekääntäjä.0(FI-ASTERI-N)000058058  a18b001c3  a18b003c3  a18b201c3  a19b401c3  a18b501c3  a10b601c3  a12b701c3  a9b801c3  a18b901c342qimage/jpeguhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=getimage&ISBN=9789510425299zKansikuva42qtext/htmluhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=showreferat&ISBN=9789510425299zKuvaus",
    "02470njm_a22006134i_45000010008000000030011000080050017000190070015000360080041000510240018000920280016001100350020001260350026001460400008001720410013001800840018001930840017002111100028002282450030002562460025002862460029003112600058003403000087003983360039004853370023005243380031005475000038005785050041006165110350006575960010010076500039010176500033010566500049010896500029011386500033011676500051012007000031012518520015012828520015012978520015013129790036013279790035013639790037013989790042014359790046014779790035015239790035015589790049015939790035016429790056016779790046017339790040017799790037018191247533ANDL10001320180613110936.0sd |||g|||m||d111129s2011    fi rc||__||||||__ | eng||3 a643004379002802aSCENECD-002  a(FI-BTJ)1652326  a(FI-MELINDA)007301531  bfin0 dengdfin  a78.891122ykl  a78.89112ykl2 aNightwish,eesittäjä.10aImaginaerum /cNightwish.33aImaginaerum original33aImaginaerum instrumental  a[Kustannuspaikka tuntematon] :bScene Nation,cp2011.  a2 CD-äänilevyä (74 min 56 s, 73 min 56 s) +etekstiliite (24 s.) + 2 julistetta  aesitetty musiikkibprm2rdacontent  aaudiobs2rdamedia  aäänilevybsd2rdacarrier  aLaulujen sanat tekstiliitteessä.0 aCD 1: Original ; CD 2: Instrumental.0 aNightwish: Anette Olzon (voc), Marco Hietala (b, voc), Emppu Vuorinen (g), Jukka Nevalainen (dr, perc), Tuomas Holopainen (keys, p) & The Metro Voices, The Young Musicians London, The Looking Glass Orchestra, Pekka Kuusisto (v), Troy Donockley (säkkipilli, low whistle, bodhran, buzuki), Dermot Crehan (hardangerviulu), Dirk Campbell (sorna)...  bLO506 7aheavy rockzSuomiy2010-luku2musa 7arockzSuomiy2010-luku2musa 7aprogressiivinen rockzSuomiy2010-luku2musa 7akuorotxheavy rock2musa 7aorkesteritxheavy rock2musa 7akelttiläinen kansanmusiikkixheavy rock2musa1 aShearman, James,ejohtaja.  a18b001c4  a19b401c4  a18b501c4  aanders.1261392bTaikatalvihfin  aanders.1261393bStorytimeheng  aanders.1261394bGhost riverheng  aanders.1261395bSlow, love, slowheng  aanders.1261396bI want my tears backheng  aanders.1261397bScaretaleheng  aanders.1261398bArabesqueheng  aanders.1261399bTurn loose the mermaidsheng  aanders.1261400bRest calmheng  aanders.1261401bThe crow, the owl and the doveheng  aanders.1261402bLast ride of the dayheng  aanders.1261403bSong of myselfheng  aanders.1261404bImaginaerumheng"
];

const escapedMARC21Data = [
    // "02021cam a22005774i 4500001000800000003001100008005001700019008004100036020003100077035002500108035002600133040003500159041001300194042000900207080003000216084001400246084001900260100003200279240002600311245006000337264005700397264001100454264001100465300002300476336002800499337004900527338002500576600003100601650002600632650003600658650003200694650002000726650003600746655004900782655003600831655002900867655002300896655007900919700006000998852001501058852001501073852001501088852001501103852001501118852001501133852001501148852001401163852001501177856012601192856012501318\u001E1706985\u001EANDL100013\u001E20181011151338.4\u001E180223t20182018fi ||||g      |0| f fin  \u001E  \u001Fa978-951-0-42529-9\u001Fqsidottu\u001E  \u001Fa(FI-KV)9789510425299\u001E  \u001Fa(FI-MELINDA)012207067\u001E  \u001FaFI-NL\u001Fbfin\u001Ferda\u001FdFI-BTJ\u001FdFI-KM\u001E1 \u001Fafin\u001Fheng\u001E  \u001Fafinb\u001E1 \u001Fa820\u001Fx-3\u001F21974\/fin\/fennica\u001E  \u001Fa84.2\u001F2ykl\u001E9 \u001FaJ\u00E4nnitys\u001F2ykl\u001E1 \u001FaTudor, C. J.,\u001Fekirjoittaja.\u001E14\u001FaThe chalk man,\u001Flsuomi\u001E10\u001FaLiitu-ukko \/\u001FcC. J. Tudor ; suomentanut Raimo Salminen.\u001E 1\u001FaHelsinki :\u001FbWerner S\u00F6derstr\u00F6m osakeyhti\u00F6,\u001Fc[2018]\u001E 3\u001FaEU:ssa\u001E 4\u001Fc\u00A92018\u001E  \u001Fa426 sivua ;\u001Fc23 cm\u001E  \u001Fateksti\u001Fbtxt\u001F2rdacontent\u001E  \u001Fak\u00E4ytett\u00E4viss\u00E4 ilman laitetta\u001Fbn\u001F2rdamedia\u001E  \u001Fanide\u001Fbnc\u001F2rdacarrier\u001E04\u001FaEddie\u001Fc(fiktiivinen hahmo)\u001E 7\u001Fasalaisuudet\u001F2kaunokki\u001E 7\u001Faviestit\u001Fxpiirustukset\u001F2kaunokki\u001E 7\u001Fad\u00E9j\u00E0 vu -ilmi\u00F6\u001F2kaunokki\u001E 7\u001Famurha\u001F2kaunokki\u001E 7\u001Faaikatasot\u001Fy1986\u001Fy2016\u001F2kaunokki\u001E 7\u001Fapsykologinen j\u00E4nnityskirjallisuus\u001F2kaunokki\u001E 7\u001Faj\u00E4nnityskirjallisuus\u001F2kaunokki\u001E 7\u001Faesikoisteokset\u001F2kaunokki\u001E 7\u001Faromaanit\u001F2kaunokki\u001E 7\u001Fakaunokirjallisuus\u001Fxenglanninkielinen kirjallisuus\u001Fxk\u00E4\u00E4nn\u00F6kset\u001F2kaunokki\u001E1 \u001FaSalminen, Raimo,\u001Fek\u00E4\u00E4nt\u00E4j\u00E4.\u001F0(FI-ASTERI-N)000058058\u001E  \u001Fa18\u001Fb001\u001Fc3\u001E  \u001Fa18\u001Fb003\u001Fc3\u001E  \u001Fa18\u001Fb201\u001Fc3\u001E  \u001Fa19\u001Fb401\u001Fc3\u001E  \u001Fa18\u001Fb501\u001Fc3\u001E  \u001Fa10\u001Fb601\u001Fc3\u001E  \u001Fa12\u001Fb701\u001Fc3\u001E  \u001Fa9\u001Fb801\u001Fc3\u001E  \u001Fa18\u001Fb901\u001Fc3\u001E42\u001Fqimage\/jpeg\u001Fuhttp:\/\/data.kirjavalitys.fi\/data\/servlets\/ProductRequestServlet?action=getimage&ISBN=9789510425299\u001FzKansikuva\u001E42\u001Fqtext\/html\u001Fuhttp:\/\/data.kirjavalitys.fi\/data\/servlets\/ProductRequestServlet?action=showreferat&ISBN=9789510425299\u001FzKuvaus\u001E\u001D",
    "02116cam a22006014i 4500001000800000003001100008005001700019008004100036020003100077035002500108035002600133040003500159041001300194042000900207080003000216084001400246084001900260100003200279240002600311245006000337264005700397264001100454264001100465300002300476336002800499337004900527338002500576600003100601650002600632650003600658650003200694650002000726650003600746655004900782655003600831655002900867655002300896655007900919700006000998852001501058852001501073852001501088852001501103852001501118852001501133852001501148852001401163852001501177856012601192856012501318990002501443990004601468\u001E1706985\u001EANDL100013\u001E20181011151338.4\u001E180223t20182018fi ||||g      |0| f fin  \u001E  \u001Fa978-951-0-42529-9\u001Fqsidottu\u001E  \u001Fa(FI-KV)9789510425299\u001E  \u001Fa(FI-MELINDA)012207067\u001E  \u001FaFI-NL\u001Fbfin\u001Ferda\u001FdFI-BTJ\u001FdFI-KM\u001E1 \u001Fafin\u001Fheng\u001E  \u001Fafinb\u001E1 \u001F21974\/fin\/fennica\u001Fa820\u001Fx-3\u001E  \u001F2ykl\u001Fa84.2\u001E9 \u001F2ykl\u001FaJ\u00E4nnitys\u001E1 \u001FaTudor, C. J.,\u001Fekirjoittaja.\u001E14\u001FaThe chalk man,\u001Flsuomi\u001E10\u001FaLiitu-ukko \/\u001FcC. J. Tudor ; suomentanut Raimo Salminen.\u001E 1\u001FaHelsinki :\u001FbWerner S\u00F6derstr\u00F6m osakeyhti\u00F6,\u001Fc[2018]\u001E 3\u001FaEU:ssa\u001E 4\u001Fc\u00A92018\u001E  \u001Fa426 sivua ;\u001Fc23 cm\u001E  \u001F2rdacontent\u001Fateksti\u001Fbtxt\u001E  \u001F2rdamedia\u001Fak\u00E4ytett\u00E4viss\u00E4 ilman laitetta\u001Fbn\u001E  \u001F2rdacarrier\u001Fanide\u001Fbnc\u001E04\u001FaEddie\u001Fc(fiktiivinen hahmo)\u001E 7\u001F2kaunokki\u001Fasalaisuudet\u001E 7\u001F2kaunokki\u001Faviestit\u001Fxpiirustukset\u001E 7\u001F2kaunokki\u001Fad\u00E9j\u00E0 vu -ilmi\u00F6\u001E 7\u001F2kaunokki\u001Famurha\u001E 7\u001F2kaunokki\u001Faaikatasot\u001Fy1986\u001Fy2016\u001E 7\u001F2kaunokki\u001Fapsykologinen j\u00E4nnityskirjallisuus\u001E 7\u001F2kaunokki\u001Faj\u00E4nnityskirjallisuus\u001E 7\u001F2kaunokki\u001Faesikoisteokset\u001E 7\u001F2kaunokki\u001Faromaanit\u001E 7\u001F2kaunokki\u001Fakaunokirjallisuus\u001Fxenglanninkielinen kirjallisuus\u001Fxk\u00E4\u00E4nn\u00F6kset\u001E1 \u001F0(FI-ASTERI-N)000058058\u001FaSalminen, Raimo,\u001Fek\u00E4\u00E4nt\u00E4j\u00E4.\u001E  \u001Fa18\u001Fb001\u001Fc3\u001E  \u001Fa18\u001Fb003\u001Fc3\u001E  \u001Fa18\u001Fb201\u001Fc3\u001E  \u001Fa19\u001Fb401\u001Fc3\u001E  \u001Fa18\u001Fb501\u001Fc3\u001E  \u001Fa10\u001Fb601\u001Fc3\u001E  \u001Fa12\u001Fb701\u001Fc3\u001E  \u001Fa9\u001Fb801\u001Fc3\u001E  \u001Fa18\u001Fb901\u001Fc3\u001E42\u001Fqimage\/jpeg\u001Fuhttp:\/\/data.kirjavalitys.fi\/data\/servlets\/ProductRequestServlet?action=getimage&ISBN=9789510425299\u001FzKansikuva\u001E42\u001Fqtext\/html\u001Fuhttp:\/\/data.kirjavalitys.fi\/data\/servlets\/ProductRequestServlet?action=showreferat&ISBN=9789510425299\u001FzKuvaus\u001E  \u001FaNot made in Finland.\u001E  \u001FaVerkkoaineisto\u001Fuhttp:\/\/hopero.dev\u001FyLinkki\u001E\u001D",
    "02470njm_a22006134i_4500001000800000003001100008005001700019007001500036008004100051024001800092028001600110035002000126035002600146040000800172041001300180084001800193084001700211110002800228245003000256246002500286246002900311260005800340300008700398336003900485337002300524338003100547500003800578505004100616511035000657596001001007650003901017650003301056650004901089650002901138650003301167650005101200700003101251852001501282852001501297852001501312979003601327979003501363979003701398979004201435979004601477979003501523979003501558979004901593979003501642979005601677979004601733979004001779979003701819\u001E1247533\u001EANDL100013\u001E20180613110936.0\u001Esd |||g|||m||d\u001E111129s2011    fi rc||__||||||__ | eng||\u001E3 \u001Fa6430043790028\u001E02\u001FaSCENECD-002\u001E  \u001Fa(FI-BTJ)1652326\u001E  \u001Fa(FI-MELINDA)007301531\u001E  \u001Fbfin\u001E0 \u001Fdeng\u001Fdfin\u001E  \u001Fa78.89112\u001F2ykl\u001E  \u001Fa78.8911\u001F2ykl\u001E2 \u001FaNightwish,\u001Feesitt\u00E4j\u00E4.\u001E10\u001FaImaginaerum \/\u001FcNightwish.\u001E33\u001FaImaginaerum original\u001E33\u001FaImaginaerum instrumental\u001E  \u001Fa[Kustannuspaikka tuntematon] :\u001FbScene Nation,\u001Fcp2011.\u001E  \u001Fa2 CD-\u00E4\u00E4nilevy\u00E4 (74 min 56 s, 73 min 56 s) +\u001Fetekstiliite (24 s.) + 2 julistetta\u001E  \u001Faesitetty musiikki\u001Fbprm\u001F2rdacontent\u001E  \u001Faaudio\u001Fbs\u001F2rdamedia\u001E  \u001Fa\u00E4\u00E4nilevy\u001Fbsd\u001F2rdacarrier\u001E  \u001FaLaulujen sanat tekstiliitteess\u00E4.\u001E0 \u001FaCD 1: Original ; CD 2: Instrumental.\u001E0 \u001FaNightwish: Anette Olzon (voc), Marco Hietala (b, voc), Emppu Vuorinen (g), Jukka Nevalainen (dr, perc), Tuomas Holopainen (keys, p) & The Metro Voices, The Young Musicians London, The Looking Glass Orchestra, Pekka Kuusisto (v), Troy Donockley (s\u00E4kkipilli, low whistle, bodhran, buzuki), Dermot Crehan (hardangerviulu), Dirk Campbell (sorna)...\u001E  \u001FbLO506\u001E 7\u001Faheavy rock\u001FzSuomi\u001Fy2010-luku\u001F2musa\u001E 7\u001Farock\u001FzSuomi\u001Fy2010-luku\u001F2musa\u001E 7\u001Faprogressiivinen rock\u001FzSuomi\u001Fy2010-luku\u001F2musa\u001E 7\u001Fakuorot\u001Fxheavy rock\u001F2musa\u001E 7\u001Faorkesterit\u001Fxheavy rock\u001F2musa\u001E 7\u001Fakelttil\u00E4inen kansanmusiikki\u001Fxheavy rock\u001F2musa\u001E1 \u001FaShearman, James,\u001Fejohtaja.\u001E  \u001Fa18\u001Fb001\u001Fc4\u001E  \u001Fa19\u001Fb401\u001Fc4\u001E  \u001Fa18\u001Fb501\u001Fc4\u001E  \u001Faanders.1261392\u001FbTaikatalvi\u001Fhfin\u001E  \u001Faanders.1261393\u001FbStorytime\u001Fheng\u001E  \u001Faanders.1261394\u001FbGhost river\u001Fheng\u001E  \u001Faanders.1261395\u001FbSlow, love, slow\u001Fheng\u001E  \u001Faanders.1261396\u001FbI want my tears back\u001Fheng\u001E  \u001Faanders.1261397\u001FbScaretale\u001Fheng\u001E  \u001Faanders.1261398\u001FbArabesque\u001Fheng\u001E  \u001Faanders.1261399\u001FbTurn loose the mermaids\u001Fheng\u001E  \u001Faanders.1261400\u001FbRest calm\u001Fheng\u001E  \u001Faanders.1261401\u001FbThe crow, the owl and the dove\u001Fheng\u001E  \u001Faanders.1261402\u001FbLast ride of the day\u001Fheng\u001E  \u001Faanders.1261403\u001FbSong of myself\u001Fheng\u001E  \u001Faanders.1261404\u001FbImaginaerum\u001Fheng\u001E\u001D",
    "01455cgm a22004334i 4500001000800000003001100008005001700019007001000036008004100046024001800087028002200105035002600127035002600153040001300179041000800192049000700200084001400207245005000221260003600271300004700307336005100354337002300405338003000428500003000458506003300488511009500521534003800616650003200654650003200686650003300718655004800751655002300799700003600822700003400858700003700892700004600929710003100975852001501006\u001E1761669\u001EANDL100013\u001E20190321110817.1\u001Evd|cvaiz|\u001E141106s2014    fi ||| g|||||  |||vlfin|c\u001E3 \u001Fa6416415963375\u001E41\u001FbVLMedia\u001FaVLDVD633\u001E  \u001Fa(FI-MELINDA)007220957\u001E  \u001Fa(FI-MELINDA)007220957\u001E  \u001Fbfin\u001Ferda\u001E0 \u001Fafin\u001E  \u001FcK7\u001E  \u001Fa84.2\u001F2ykl\u001E04\u001FaThe joulukalenteri \/\u001Fcohjaus: Jukka Virtanen.\u001E  \u001Fa[Nummela] :\u001FbVLMedia Oy,\u001Fc2014.\u001E  \u001Fa2 DVD-videolevy\u00E4 (322 min) :\u001Fbv\u00E4rillinen\u001E  \u001Fakaksiulotteinen liikkuva kuva\u001Fbtdi\u001F2rdacontent\u001E  \u001Favideo\u001Fbv\u001F2rdamedia\u001E  \u001Favideolevy\u001Fbvd\u001F2rdacarrier\u001E  \u001FaLainaus- ja esitysoikeus.\u001E  \u001FaKielletty alle 7-vuotiailta.\u001E0 \u001FaP\u00E4\u00E4osissa: Raimo Smedberg, Seppo Korjus, Kari Lehtom\u00E4ki (Trio Saletti), Jukka Virtanen.\u001E  \u001FpAlun perin julkaistu:\u001FcMTV, 1997.\u001E 7\u001Fajoulu\u001Fxkalenterit\u001F2kaunokki\u001E 7\u001Fatontut\u001Fxeksyminen\u001F2kaunokki\u001E 7\u001Fatontut\u001Fxteht\u00E4v\u00E4t\u001F2kaunokki\u001E 7\u001Fatelevisiosarjat\u001FzSuomi\u001Fy1990-luku\u001F2kaunokki\u001E 7\u001Fakomediat\u001F2kaunokki\u001E1 \u001FaSmedberg, Raimo,\u001Fen\u00E4yttelij\u00E4.\u001E1 \u001FaKorjus, Seppo,\u001Fen\u00E4yttelij\u00E4.\u001E1 \u001FaLehtom\u00E4ki, Kari,\u001Fen\u00E4yttelij\u00E4.\u001E1 \u001FaVirtanen, Jukka,\u001Fen\u00E4yttelij\u00E4,\u001Feohjaaja.\u001E2 \u001FaTrio Saletti,\u001Feesitt\u00E4j\u00E4.\u001E  \u001Fa18\u001Fb001\u001Fc3\u001E\u001D"
];

const addUserToDb = async (username, password, staff, tfa) => {
    const passwordHash = await bcrypt.hash(password, 13);
    const newUserData = {
        username,
        passwordHash,
        name: "user",
        staff,
        barcode: "asd" + Math.random(),
        shelves: [],
        loans: [],
    };
    const secret = otp.generateSecret({ encoding: "base32" }).base32;
    if (tfa) newUserData.TFACode = secret;
    const newUser = new User(newUserData);
    const user = await newUser.save();
    if (tfa) return { user, TFACode: secret };
    else return user;
};

const addRecordToDb = async () => {
    const newRecord = new Record({
        timeAdded: new Date(),
        timeModified: new Date(),
        title: "A New Book",
        alphabetizableTitle: "new book",
        description: "",
        image: "",
        contentType: "a",
        year: 2019,
        author: "Virtanen, Juhani,",
        authors: [
            "Virtanen, Juhani,",
            "Virtanen, Maria,"
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
        record: "custom",
        items: []
    });
    try {
        const savedRecord = await newRecord.save();
        return savedRecord._id;
    }
    catch (err) {
        console.log(err);
    }
};

const addLocationToDb = async name => {
    const newLocation = new Location({
        name
    });
    try {
        const savedLocation = await newLocation.save();
        return savedLocation._id;
    }
    catch (err) {
        console.log(err);
    }
};

const addShelfToDb = async (name, publicity, authorId, sharedWith, records = []) => {
    const newShelf = new Shelf({
        name,
        description: "This is a shelf.",
        public: publicity,
        author: authorId,
        records: records,
        sharedWith
    });
    try {
        const savedShelf = await newShelf.save();
        return savedShelf;
    }
    catch (err) {
        console.log(err);
    }
};

const addLoantypeToDb = async (canBeLoaned, canBePlacedAHold, renewTimes, loanTime) => {
    const newLoantype = new Loantype({
        name: "This is a loantype",
        canBeLoaned,
        canBePlacedAHold,
        renewTimes,
        loanTime
    });
    try {
        return await newLoantype.save();
    }
    catch (err) {
        console.log(err);
    }
};

const addItemToDb = async (record, location, loantype) => {
    const newItem = new Item({
        created: new Date(),
        record,
        location,
        loantype,
        barcode: "moikkuli-" + Math.random(),
        state: "not loaned",
        shelfLocation: "84.2 TUD",

        lastLoaned: new Date(0),
        loanTimes: 0
    });
    try {
        const item = await newItem.save();
        const rec = await Record.findById(record);
        rec.items.push(item);
        await rec.save();

        return item;
    }
    catch (err) {
        console.log(err);
    }
};

const addNoteToDb = async () => {
    try {
        const note = new Note({
            title: Math.random() + "hei",
            content: Math.random() + "content",
            created: new Date(),
            modified: new Date()
        });
        return await note.save();
    }
    catch (err) {
        console.log(err);
    }
};

const addRecordToShelf = async (shelf, record, note) => {
    return (await Shelf.findByIdAndUpdate(
        shelf,
        {
            $push: { records: { record, note } }
        },
        { new: true }
    )).toObject();
};

const shareShelfWith = async (shelfId, userId) => {
    const shelf = await Shelf.findByIdAndUpdate(
        shelfId,
        { $push: { sharedWith: userId } },
        { new: true }
    );

    const user = await Shelf.findByIdAndUpdate(
        userId,
        { $push: { sharedWith: shelfId._id } },
        { new: true }
    );

    return {
        user,
        shelf
    };
};

const loanItemTo = async (userId, itemId) => {
    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId).populate("loantype");
        const location = await Location.findById(item.location);

        user.loans.push(item._id);
        item.statePersonInCharge = user._id;
        item.stateTimesRenewed = 0;
        item.state = "loaned";
        item.lastLoaned = new Date();
        item.loanTimes += 1;

        location.loanTimes = location.loantimes + 1 || 1;

        const dueDate = new Date();
        dueDate.setUTCDate(dueDate.getUTCDate() + (item.loantype.loanTime || 1));
        item.stateDueDate = dueDate;

        await location.save();
        await user.save();
        await item.save();

        return { user, item };
    }
    catch (err) {
        console.log(err);
    }
};

const itemIsLoanedBy = async (userId, itemId) => {
    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId);

        if (user.loans.indexOf(itemId.toString()) > -1 && (item.statePersonInCharge && item.statePersonInCharge.toString()) === userId.toString() && item.state === "loaned") return true;

        return false;
    }
    catch (err) {
        console.log(err);
    }
};

const itemIsNotLoanedBy = async (userId, itemId) => {
    try {
        const user = await User.findById(userId);
        const item = await Item.findById(itemId);

        if (user.loans.indexOf(itemId.toString()) === -1 && (item.statePersonInCharge && item.statePersonInCharge.toString()) !== userId.toString()) return true;

        return false;
    }
    catch (err) {
        console.log(err);
    }
};

const getTokenForUser = user => {
    const tokenData = {
        id: user._id,
        username: user.username,
        name: user.name
    };
    return jwt.sign(tokenData, SECRET);
};

const getUser = async id => (await User.findById(id)).toObject();
const getShelf = async id => (await Shelf.findById(id)).toObject();

const clearDatabase = async () => {
    await Record.deleteMany({});
    await User.deleteMany({});
    await Location.deleteMany({});
    await Loantype.deleteMany({});
    await Shelf.deleteMany({});
    await Item.deleteMany({});
    await Note.deleteMany({});
};

const usersInDb = async () => (await User.find({})).length;
const recordsInDb = async () => (await Record.find({})).length;
const locationsInDb = async () => (await Location.find({})).length;
const shelvesInDb = async () => (await Shelf.find({})).length;
const loantypesInDb = async () => (await Loantype.find({})).length;
const itemsInDb = async () => (await Item.find({})).length;
const notesInDb = async () => (await Note.find({})).length;

const generateCode = secret => {
    return otp.totp({
        secret,
        encoding: "base32"
    });
};

module.exports = {
    addUserToDb,
    addRecordToDb,
    addLocationToDb,
    addShelfToDb,
    addItemToDb,
    addLoantypeToDb,
    addNoteToDb,
    clearDatabase,

    addRecordToShelf,
    shareShelfWith,

    loanItemTo,
    itemIsLoanedBy,
    itemIsNotLoanedBy,

    getTokenForUser,

    initMARC21Data,
    escapedMARC21Data,

    getUser,
    getShelf,

    usersInDb,
    recordsInDb,
    locationsInDb,
    shelvesInDb,
    loantypesInDb,
    itemsInDb,
    notesInDb,

    generateCode
};