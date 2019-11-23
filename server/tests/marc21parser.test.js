const MARC21 = require("../utils/marc21parser");

const marcs = [
    "03420cgm a22006855i 45000010008000000030011000080050017000190070010000360080041000460240018000870280032001050350026001370350026001630400022001890410043002110460012002540490007002660840014002732450272002872640121005592640011006803000065006913360051007563370023008073380030008304900025008605060033008855110187009185340033011055400019011385460142011575880021012996500058013206500058013786500059014366500070014956500062015656500060016276510017016876550047017046550065017516550068018166550068018846550059019527000053020117000042020647000074021067000066021807000035022467000029022817000039023107100043023497100046023927300031024387300062024698520015025318560064025468560052026108560072026621723462ANDL10001320180816121245.6vd|cvaizq180815t20182018fi 100|j|||||  |||vafin|c3 a871741852135641bDisney/PixaraZLABLA3141020  a(FI-MELINDA)013523735  a(FI-MELINDA)013523735  aFI-Pikibfinerda1 afinaengasweaestjfinjswejengheng  ask2017  cK7  a84.22ykl00aCoco /cDisney presents a Pixar Animation Studios film ; directed by Lee Unkrich ; co-directed by Adrian Molina ; produced by Darla K. Anderson ; original story by Lee Unkrich, Jason Katz, Matthew Aldrich, Adrian Molina ; screenplay by Adrian Molina, Matthew Aldrich. 2aHelsinki :bWalt Disney Studios Home Entertainment Finland, a division of The Walt Disney Company Nordic AB,c[2018] 4c©2018  a1 DVD-videolevy (1 h 40 min) :bvärillinen, ääni ;c12 cm  akaksiulotteinen liikkuva kuvabtdi2rdacontent  avideobv2rdamedia  avideolevybvd2rdacarrier1 aPixar Klassikko,v191 aKielletty alle 7-vuotiailta.0 aSuomenkieliset äänet: Luca Elshout, Markus Niemi, Waltteri Torikka, Sari Ann Stolt, Ritva Oksanen, Lari Halme, Markku Huhtamo, Jukka Puotila, Pekka Autiovuori, Sami Yaffa ja muita.  pAlun perin julkaistu:c2017.  aLainausoikeus.  aVaihtoehtoiset ääniraidat: suomi, englanti, ruotsi, viro ; tekstitys: suomi, ruotsi sekä englanti kuulovammaisille. - Kielet levyltä.0 aNimeke levystä. 7aunelmat2kaunokki0http://www.yso.fi/onto/kauno/p2061 7aammatit2kaunokki0http://www.yso.fi/onto/kauno/p2393 7amuusikot2kaunokki0http://www.yso.fi/onto/kauno/p1637 7apojat (ikäryhmät)2kaunokki0http://www.yso.fi/onto/kauno/p1589 7aesivanhemmat2kaunokki0http://www.yso.fi/onto/kauno/p434 7aseikkailu2kaunokki0http://www.yso.fi/onto/kauno/p2904 7aMeksiko2ysa 7aelokuvatzyhdysvallaty2010-luku2kaunokki 7alastenelokuvat2kaunokki0http://www.yso.fi/onto/kauno/p2527 7aanimaatioelokuvat2kaunokki0http://www.yso.fi/onto/kauno/p3102 7aseikkailuelokuvat2kaunokki0http://www.yso.fi/onto/kauno/p4667 7akomediat2kaunokki0http://www.yso.fi/onto/kauno/p23471 aUnkrich, Lee,eohjaaja,ealkuperäisidean luoja.1 aKatz, Jason,ealkuperäisidean luoja.1 aMolina, Adrian,eohjaaja,ealkuperäisidean luoja,ekäsikirjoittaja.1 aAldrich, Matthew,ealkuperäisidean luoja,ekäsikirjoittaja.1 aAnderson, Darla K.,etuottaja.1 aAspbury, Matt,ekuvaaja.1 aGiacchino, Michael,esäveltäjä.2 aWalt Disney Pictures,etuotantoyhtiö.2 aPixar Animation Studios,etuotantoyhtiö.02iSisältää (teos):aCoco.02iSisältää (ekspressio):aCoco (elokuva : 2017),lsuomi.  a18b001c142uhttps://www.imdb.com/title/tt2380307/?ref_=ttfc_fc_ttyIMDb42uhttp://www.elonet.fi/fi/elokuva/1593320yElonet42uhttps://fi.wikipedia.org/wiki/Coco_(vuoden_2017_elokuva)yWikipedia",
    "02019cam a22005654i 45000010008000000030011000080050017000190080041000360150019000770200031000960240018001270350025001450350026001700400010001960410008002060420009002140800025002230840014002481000068002622450081003302460024004112600061004353000035004963360028005313370049005593380025006085000032006336500033006656500026006986500026007246500020007506500030007706500057008006500042008576500034008996550028009336550026009616550025009876550021010127000064010338520015010978520015011128520015011278520015011428520015011578520015011728520015011878560126012028560125013281351532ANDL10001320171120122411.4131028s2013    fi ||||j     |00| p|fin|   afx10374902skl  a978-952-288-021-5qsidottu3 a9789522880215  a(FI-KV)9789522880215  a(FI-MELINDA)006446440  aFI-NL0 afin  afinb  a894.541x-1x(024.7)  a82.22ykl1 aKorolainen, Tuula,d1948-ekirjoittaja.0(FI-ASTERI-N)00004834410aKissa kissa kissa /c[teksti:] Tuula Korolainen ; kuvittanut Virpi Talvitie.3 aKissa, kissa, kissa  aHelsinki :bLasten keskus,c2013e(Helsinki :fPremedia)  a61 sivua :bkuvitettu ;c24 cm  atekstibtxt2rdacontent  akäytettävissä ilman laitettabn2rdamedia  anidebnc2rdacarrier  aLisäpainokset: 2. p. 2014. 7alastenkirjallisuus2kaunokki 7alastenrunot2kaunokki 7aeläinrunot2kaunokki 7akissa2kaunokki 7arunotxeläimet2kaunokki 7alastenkirjallisuusxsuomenkielinen kirjallisuus2ysa 7alastenkirjallisuusxsuomen kieli2ysa 7akuvakirjatxsuomen kieli2ysa 7afinsk litteratur2bella 7abarnlitteratur2bella 7abilderböcker2bella 7abarnlyrik2bella1 aTalvitie, Virpi,d1961-ekuvittaja.0(FI-ASTERI-N)000115356  a18b001c1  a18b002c1  a18b201c1  a18b501c1  a12b701c1  a18b901c1  a20b909c142qimage/jpeguhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=getimage&ISBN=9789522880215zKansikuva42qtext/htmluhttp://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=showreferat&ISBN=9789522880215zKuvaus",
    "01603njm  22004457a 45000010008000000080047000080240018000550280035000730410018001080910007001260940011001330950012001441000029001562450035001852600040002203000040002605000035003005050145003355110216004805180076006965460013007725750037007855770028008225990021008506480014008716500027008856510011009126550016009237000031009397000032009707000031010027000031010337000025010647000030010898520008011198520008011278520008011358520008011439770006011512284684140317s2016    xx |||||||||||||| | eng||njm a 3 a541493994432101aPIASR905CDXbPlay It Again Sam0 aengdenggeng  a77  a78.891  a788.33 1 aObel, Agnes,eesittäjä10aCitizen of glass /cAgnes Obel  a[S.l.] :bPlay It Again Sam,cp2016  a1 CD-äänilevy +elaulutekstiliite  aLiitteessä kappaleiden sanat.0 aStretch your eyes. Familiar. Red virgin soil. It's happening again. Stone. Trojan horses. Citizen of glass. Golden green. Grasshopper. Mary.0 aAgnes Obel (säveltäjä, sanoittaja, voc, perc, p, ml, cembalo, keyb). Mukana myös: Kristina Koropecki (vc), Charlotte Danhier (vc), Frederique Labbow (vc), John Corban (v), Daniel Matz (trautonium, helistin).  aÄänitys: 2014-2016, Chalk Wood Studio & Brand New Studio (Berliini).   aenglanti  atoni.korpi@espoo.fi b1701espmus  b2 VIIKON LAINA 01-07-17  aCDLEVY / CDSKIVA 7a2010-luku 7alaulaja-lauluntekijät 7aTanska 7apopmusiikki1 aObel, Agnes,esäveltäjä1 aKoropecki, Kristina,esello1 aDanhier, Charlotte,esello1 aLabbow, Frederique,esello1 aCorban, John,eviulu1 aMatz, Daniel,etrautonium  bh90  bh53  bv60  bh72  a3"
];

const [test, afterAll] = [it, after];
const expect = require("expect");

describe("parser can parse marc21 string to JSON", () => {
    describe("#1", () => {
        const parsedMARC = MARC21.parse(marcs[0]);

        test("parser can parse LEADER correct", () => {
            expect(parsedMARC.LEADER).toBe("03420cgm a22006855i 4500");
        });
        test("parser can parse fields 001-009 correct", () => {
            expect(parsedMARC.FIELDS["001"][0]).toBe("1723462");
            expect(parsedMARC.FIELDS["008"][0]).toBe("180815t20182018fi 100|j|||||  |||vafin|c");
        });
        test("parsed object does not have data property", () => {
            expect(parsedMARC.FIELDS["588"][0].data).not.toBeDefined();
        });
        test("parser can parse normal data fields (010->)", () => {
            expect(parsedMARC.FIELDS["588"][0].subfields["a"][0]).toBe("Nimeke levystä.");
            expect(parsedMARC.FIELDS["650"][2].subfields["a"][0]).toBe("muusikot");
            expect(parsedMARC.FIELDS["245"][0].subfields["c"][0]).toBe("Disney presents a Pixar Animation Studios film ; directed by Lee Unkrich ; co-directed by Adrian Molina ; produced by Darla K. Anderson ; original story by Lee Unkrich, Jason Katz, Matthew Aldrich, Adrian Molina ; screenplay by Adrian Molina, Matthew Aldrich.");
            expect(parsedMARC.FIELDS["856"][0].indicators).toEqual([
                "4",
                "2"
            ]);
        });
    });

    describe("#2", () => {
        const parsedMARC = MARC21.parse(marcs[1]);

        test("parser can parse LEADER correct", () => {
            expect(parsedMARC.LEADER).toBe("02019cam a22005654i 4500");
        });
        test("parser can parse fields 001-009 correct", () => {
            expect(parsedMARC.FIELDS["001"][0]).toBe("1351532");
            expect(parsedMARC.FIELDS["008"][0]).toBe("131028s2013    fi ||||j     |00| p|fin| ");
        });
        test("parsed object does not have data property", () => {
            expect(parsedMARC.FIELDS["856"][0].data).not.toBeDefined();
        });
        test("parser can parse normal data fields (010->)", () => {
            expect(parsedMARC.FIELDS["856"][0].subfields["u"][0]).toBe("http://data.kirjavalitys.fi/data/servlets/ProductRequestServlet?action=getimage&ISBN=9789522880215");
            expect(parsedMARC.FIELDS["650"][7].subfields["a"][0]).toBe("kuvakirjat");
            expect(parsedMARC.FIELDS["245"][0].subfields["c"][0]).toBe("[teksti:] Tuula Korolainen ; kuvittanut Virpi Talvitie.");
        });
    });

    describe("#3", () => {
        const parsedMARC = MARC21.parse(marcs[2]);

        test("parser can parse LEADER correct", () => {
            expect(parsedMARC.LEADER).toBe("01603njm  22004457a 4500");
        });
        test("parser can parse fields 001-009 correct", () => {
            expect(parsedMARC.FIELDS["001"][0]).toBe("2284684");
            expect(parsedMARC.FIELDS["008"][0]).toBe("140317s2016    xx |||||||||||||| | eng||njm a ");
        });
        test("parsed object does not have data property", () => {
            expect(parsedMARC.FIELDS["977"][0].data).not.toBeDefined();
        });
        test("parser can parse normal data fields (010->)", () => {
            expect(parsedMARC.FIELDS["977"][0].subfields["a"][0]).toBe("3");
            expect(parsedMARC.FIELDS["700"][2].subfields["e"][0]).toBe("sello");
            expect(parsedMARC.FIELDS["655"][0].subfields["a"][0]).toBe("popmusiikki");
            expect(parsedMARC.FIELDS["648"][0].subfields["a"][0]).toBe("2010-luku");
            expect(parsedMARC.FIELDS["648"][0].indicators).toEqual([
                " ",
                "7"
            ]);
        });
    });

    describe("and stringify it back to marc21 string", () => {
        /*
        // This is not neccesary because subfields may be in different order

        test("#1", () => {
            expect(MARC21.stringify(MARC21.parse(marcs[0]))).toBe(marcs[0]);
        });
        test("#2", () => {
            expect(MARC21.stringify(MARC21.parse(marcs[1]))).toBe(marcs[1]);
        });
        test("#3", () => {
            expect(MARC21.stringify(MARC21.parse(marcs[2]))).toBe(marcs[2]);
        }); */

        describe("and back to JSON again", () => {
            test("#1", () => {
                expect(MARC21.parse(MARC21.stringify(MARC21.parse(marcs[0])))).toEqual(MARC21.parse(marcs[0]));
            });
            test("#2", () => {
                expect(MARC21.parse(MARC21.stringify(MARC21.parse(marcs[1])))).toEqual(MARC21.parse(marcs[1]));
            });
            test("#3", () => {
                expect(MARC21.parse(MARC21.stringify(MARC21.parse(marcs[2])))).toEqual(MARC21.parse(marcs[2]));
            });
        });
    });
});

const marcxml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><collection xmlns=\"http://www.loc.gov/MARC21/slim\"><record><leader>04044cam a2201165 i 4500</leader><controlfield tag=\"001\">951238</controlfield><controlfield tag=\"003\">FI-J</controlfield><controlfield tag=\"005\">20190827074648.0</controlfield><controlfield tag=\"008\">040531s2004    fi |||||||||||||||||fin| </controlfield><datafield tag=\"015\" ind1=\" \" ind2=\" \"><subfield code=\"a\">fx772537</subfield><subfield code=\"2\">skl</subfield></datafield><datafield tag=\"020\" ind1=\" \" ind2=\" \"><subfield code=\"a\">9517465572</subfield><subfield code=\"q\">sidottu</subfield></datafield><datafield tag=\"020\" ind1=\" \" ind2=\" \"><subfield code=\"a\">978-951-746-557-1</subfield><subfield code=\"q\">sidottu</subfield></datafield><datafield tag=\"024\" ind1=\"3\" ind2=\" \"><subfield code=\"a\">9789517465571</subfield></datafield><datafield tag=\"035\" ind1=\" \" ind2=\" \"><subfield code=\"a\">FCC001007813</subfield></datafield><datafield tag=\"035\" ind1=\" \" ind2=\" \"><subfield code=\"a\">951238</subfield></datafield><datafield tag=\"040\" ind1=\" \" ind2=\" \"><subfield code=\"a\">FI-NL</subfield></datafield><datafield tag=\"041\" ind1=\"0\" ind2=\" \"><subfield code=\"a\">fin</subfield></datafield><datafield tag=\"060\" ind1=\" \" ind2=\"4\"><subfield code=\"a\">PH</subfield></datafield><datafield tag=\"072\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">85</subfield><subfield code=\"2\">kkaa</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">801.3</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">811.511.111</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">809.4</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">809.454.1</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">809.454.1</subfield><subfield code=\"x\">-5</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">81'36</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">81'36:809.454.1</subfield></datafield><datafield tag=\"080\" ind1=\" \" ind2=\" \"><subfield code=\"a\">80</subfield></datafield><datafield tag=\"084\" ind1=\" \" ind2=\" \"><subfield code=\"a\">88.2</subfield><subfield code=\"2\">ykl</subfield></datafield><datafield tag=\"084\" ind1=\" \" ind2=\" \"><subfield code=\"a\">88.23</subfield><subfield code=\"2\">ykl</subfield></datafield><datafield tag=\"084\" ind1=\" \" ind2=\" \"><subfield code=\"a\">88.23</subfield></datafield><datafield tag=\"245\" ind1=\"0\" ind2=\"0\"><subfield code=\"a\">Iso suomen kielioppi /</subfield><subfield code=\"c\">Auli Hakulinen, päätoimittaja ... [ja muita].</subfield></datafield><datafield tag=\"260\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Helsinki :</subfield><subfield code=\"b\">Suomalaisen Kirjallisuuden Seura,</subfield><subfield code=\"c\">2004</subfield><subfield code=\"e\">(Hämeenlinna :</subfield><subfield code=\"f\">Karisto)</subfield></datafield><datafield tag=\"300\" ind1=\" \" ind2=\" \"><subfield code=\"a\">1698 s. :</subfield><subfield code=\"b\">kuvitettu ;</subfield><subfield code=\"c\">26 cm</subfield></datafield><datafield tag=\"336\" ind1=\" \" ind2=\" \"><subfield code=\"a\">teksti</subfield><subfield code=\"b\">txt</subfield><subfield code=\"2\">rdacontent</subfield></datafield><datafield tag=\"337\" ind1=\" \" ind2=\" \"><subfield code=\"a\">käytettävissä ilman laitetta</subfield><subfield code=\"b\">n</subfield><subfield code=\"2\">rdamedia</subfield></datafield><datafield tag=\"338\" ind1=\" \" ind2=\" \"><subfield code=\"a\">nide</subfield><subfield code=\"b\">nc</subfield><subfield code=\"2\">rdacarrier</subfield></datafield><datafield tag=\"490\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Suomalaisen Kirjallisuuden Seuran toimituksia,</subfield><subfield code=\"x\">0355-1768 ;</subfield><subfield code=\"v\">950</subfield></datafield><datafield tag=\"500\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Lisäpainokset: 2. p. 2004. - 3. p. 2005. - 4. p. 2010.</subfield></datafield><datafield tag=\"500\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Lisäpainokset: 3. p. 2005.</subfield></datafield><datafield tag=\"505\" ind1=\"0\" ind2=\" \"><subfield code=\"a\">Sanat. -- Äänne- ja muotorakenne. -- Sananmuodostus. -- Rakenne. -- Sanat ja niiden muodostamat rakenteet. -- Lause ja lausuma. -- Yhdysrakenteet. -- Ilmiöt.</subfield></datafield><datafield tag=\"530\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Myös verkkoaineistona (ISBN 978-952-5446-35-7).</subfield></datafield><datafield tag=\"530\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Julkaistu myös verkkoaineistona.</subfield></datafield><datafield tag=\"530\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Verkkoaineisto</subfield><subfield code=\"u\">http://scripta.kotus.fi/visk/etusivu.php</subfield></datafield><datafield tag=\"530\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Uudistettu versio julkaistu verkkoaineistona.</subfield></datafield><datafield tag=\"504\" ind1=\" \" ind2=\" \"><subfield code=\"a\">Sisältää bibliografisia viitteitä ja hakemiston.</subfield></datafield><datafield tag=\"595\" ind1=\" \" ind2=\" \"><subfield code=\"a\">4. p. 2010.</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">hakuteokset</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">suomen kieli</subfield><subfield code=\"x\">kielioppi</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">suomen kieli</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppi</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppi</subfield><subfield code=\"x\">suomen kieli</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kieliopit</subfield><subfield code=\"x\">suomen kieli</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">hakuteokset</subfield><subfield code=\"x\">suomen kieli</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">oikeinkirjoitus</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppaat</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">oikeakielisyys</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielitiede</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielenhuolto</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">finska</subfield><subfield code=\"x\">grammatik</subfield><subfield code=\"2\">allars</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">svenska</subfield><subfield code=\"x\">grammatik</subfield><subfield code=\"2\">allars</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">sanakirjat</subfield><subfield code=\"2\">agrifors</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">sanakirjat</subfield><subfield code=\"2\">pha</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">oppaat</subfield><subfield code=\"2\">pha</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">Suomen kieli</subfield><subfield code=\"2\">helecon</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">Kielitiede</subfield><subfield code=\"2\">helecon</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">Finnish</subfield><subfield code=\"2\">helecon</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">Linguistics</subfield><subfield code=\"2\">helecon</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kieliopit</subfield><subfield code=\"x\">suomen kieli</subfield><subfield code=\"2\">kta</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kieliopit</subfield><subfield code=\"2\">kta</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">suomen kieli</subfield><subfield code=\"2\">opms</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppi</subfield><subfield code=\"2\">opms</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielenhuolto</subfield><subfield code=\"2\">opms</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppaat</subfield><subfield code=\"2\">opms</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kieliopit</subfield><subfield code=\"2\">pha</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">suomen kieli</subfield><subfield code=\"2\">pha</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">suomen kieli</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppi</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"2\"><subfield code=\"a\">manuals</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"2\"><subfield code=\"a\">writing</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"2\"><subfield code=\"a\">linguistics</subfield><subfield code=\"x\">Finnish</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kieliopit</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">finska</subfield><subfield code=\"2\">allars</subfield></datafield><datafield tag=\"650\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">grammatik</subfield><subfield code=\"2\">allars</subfield></datafield><datafield tag=\"653\" ind1=\" \" ind2=\" \"><subfield code=\"a\">manuals</subfield></datafield><datafield tag=\"653\" ind1=\" \" ind2=\" \"><subfield code=\"a\">linguistics</subfield><subfield code=\"a\">Finnish</subfield></datafield><datafield tag=\"653\" ind1=\" \" ind2=\" \"><subfield code=\"a\">writing</subfield></datafield><datafield tag=\"653\" ind1=\" \" ind2=\"0\"><subfield code=\"a\">kur suo suo</subfield></datafield><datafield tag=\"655\" ind1=\" \" ind2=\"7\"><subfield code=\"a\">kielioppaat</subfield><subfield code=\"2\">ysa</subfield></datafield><datafield tag=\"700\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Vilkuna, Maria,</subfield><subfield code=\"e\">kirjoittaja.</subfield></datafield><datafield tag=\"700\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Korhonen, Riitta,</subfield><subfield code=\"e\">kirjoittaja.</subfield></datafield><datafield tag=\"700\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Koivisto, Vesa,</subfield><subfield code=\"d\">1963-</subfield><subfield code=\"e\">kirjoittaja.</subfield></datafield><datafield tag=\"700\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Hakulinen, Auli,</subfield><subfield code=\"d\">1941-,</subfield><subfield code=\"e\">kirjoittaja.</subfield></datafield><datafield tag=\"700\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Alho, Irja,</subfield><subfield code=\"e\">kirjoittaja.</subfield></datafield><datafield tag=\"700\" ind1=\"1\" ind2=\" \"><subfield code=\"a\">Heinonen, Tarja Riitta,</subfield><subfield code=\"e\">kirjoittaja.</subfield></datafield><datafield tag=\"776\" ind1=\"0\" ind2=\"8\"><subfield code=\"i\">Verkkoaineisto:</subfield><subfield code=\"z\">978-952-5446-35-7</subfield></datafield><datafield tag=\"775\" ind1=\"0\" ind2=\"8\"><subfield code=\"i\">Uudistettu versio:</subfield><subfield code=\"t\">Ison suomen kieliopin verkkoversio.</subfield><subfield code=\"d\">[Helsinki] : Suomalaisen Kirjallisuuden Seura, 2008.</subfield><subfield code=\"h\">1 verkkoaineisto.</subfield><subfield code=\"k\">Kotimaisten kielten tutkimuskeskuksen verkkojulkaisuja, 1796-041X ; 5</subfield><subfield code=\"z\">9789525446357</subfield></datafield><datafield tag=\"830\" ind1=\" \" ind2=\"0\"><subfield code=\"a\">Suomalaisen Kirjallisuuden Seuran toimituksia,</subfield><subfield code=\"x\">0355-1768 ;</subfield><subfield code=\"v\">950.</subfield></datafield><datafield tag=\"856\" ind1=\"4\" ind2=\"0\"><subfield code=\"u\">http://scripta.kotus.fi/visk/etusivu.php</subfield><subfield code=\"z\">Luettavissa myös verkossa.</subfield></datafield><datafield tag=\"999\" ind1=\" \" ind2=\" \"><subfield code=\"c\">77929</subfield><subfield code=\"d\">77929</subfield></datafield><datafield tag=\"952\" ind1=\" \" ind2=\" \"><subfield code=\"b\">KLA</subfield><subfield code=\"c\">LAINA</subfield><subfield code=\"o\">809.454.1 ISO</subfield><subfield code=\"9\">1</subfield></datafield></record></collection>";
describe("parser can parse MARCXML", () => {
    test("#1", () => {
        // TODO: Does not work in backend because there is no DOMParser class in Node.js.
        expect(1).toBe(1);
        const parsed = MARC21.MARCXMLToMARC(marcxml);
        expect(parsed.FIELDS["245"][0].subfields["a"][0]).toBe("Iso suomen kielioppi /");
    });
});