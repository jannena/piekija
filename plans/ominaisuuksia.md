# Suunniteltuja ominaisuuksia
## Tietueet
- Aineiston tallennus marc21-formaatissa (tai muussa formaatissa)
- Aineiston haku tarkennetulla haulla Boolen logiikkaa käyttäen
    - otsikko
    - ISBN/ISSN/...
    - aineistolaji
    - valmistumisvuosi / -ajankohta
    - päätekijä / muut tekijät
    - sijaintiasiasanat / henkilöasiasanat / asiasanat / genret
    - pääkieli / muut kielet
    - luokitus
- Ainakin lähes täydellinen marc21-muokkain / muun formaatin muokkain
- Tietojen haku esim. Finna-APIsta

## Käyttäjät
- Kirjahyllyt (kirjoihin liitettävät muistiinpanot)

## Lainaus
- Kirjojen lainaaminen käyttäjille, uusiminen
- Kirjojen vaaraminen, varausjonon lukitseminen

## ?Yhteisö
- ?Kirjain arvostelu ja kommentointi
- ?Kirjahyllyjen jakaminen

# "Sovellustason" ominaisuuksia
- EAN-koodin (joka kirjoissa myös ISBN) avulla kirjan tietojen haku Finna APIsta tai Goodreads APIsta tms. APIsta kameran avulla, mikäli mahdollista
- Kaksi tai useampi käyttäjä pystyy muokkaamaan samaa kirjahyllyä samanaikaisesti (websocketit).
- Monikielisyys
- (Aluksi ainakin REST- mutta ehkä myöhemmin myös GraohQL-rajapinta)