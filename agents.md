# p5.js portfólió – fejlesztési irányelvek

## A projekt célja

Ez egy **disztribúciós projekt**: a gyökérben lévő portfólió a p5.js-alprojekteket fogja össze, teszi elérhetővé és mutatja be. A projekt lényegét az önálló alprojektek adják; a főoldal elsősorban katalógus és navigáció, nem közös szimulációs alkalmazás.

Az alprojekteket külön-külön vizsgáljuk át és egységesítjük. Ne feltételezd, hogy már most azonos felépítésűek, és ne végezz több projektet érintő átalakítást külön egyeztetett feladat nélkül.

## Eszközök és technológiák

- HTML, CSS és natív JavaScript; nincs központi framework, buildlépés vagy backend.
- A p5.js-t és az egyéb függőségeket az alprojektek kezelik saját igényeik szerint; lehetnek helyi vagy CDN-ről betöltött fájlok.
- Fejlesztéshez VS Code és böngésző használható. A fájlbetöltést igénylő projektekhez indíts helyi HTTP-szervert, például a VS Code Live Server bővítményével.
- A közzététel statikus GitHub Pages-en történik.

## Fejlesztési irányelvek

- Egy alprojekt módosításakor tartsd a változtatásokat annak saját mappájában, kivéve, ha a feladat kifejezetten érinti a portfóliót vagy több projektet.
- Minden alprojekt legyen önállóan megnyitható, saját `index.html` belépőoldallal és a működéséhez szükséges fájlokkal.
- Új alprojekt mappaneve legyen rövid, ékezet és szóköz nélküli, kötőjeles név; az erőforrásokra relatív útvonalakat használj.
- Új projekt felvételekor frissítsd a főoldali hivatkozásokat és a projektek elhelyezését leíró dokumentációt.
- Tartsd meg az adott alprojekt működő megoldásait és függőségkezelését. Közös mintát vagy függőséget csak az alprojektek egyenkénti áttekintése után vezess be.
- Ellenőrizd a módosított projektet böngészőben. GitHub Pages-kompatibilitás miatt figyelj a relatív útvonalakra és a fájlnevek pontos kis- és nagybetűzésére.

