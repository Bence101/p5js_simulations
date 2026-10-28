# p5.js portfólió

Statikus, disztribúciós portfólió önálló p5.js projektek bemutatásához. A főoldal képes projektkatalógus, nem közös szimulációs alkalmazás: az alprojektek egymástól függetlenül működnek.

## Technológia

- HTML, CSS és natív JavaScript.
- Nincs framework, buildlépés vagy backend.
- GitHub Pages-en közvetlenül közzétehető.
- A p5.js függőséget az egyes alprojektek saját maguk kezelik; a portfólió főoldala nem tölti be.

## Mappaszerkezet

```text
.
|-- index.html             # Bemutatkozás és projektkártyák
|-- assets/
|   |-- css/landing.css    # A főoldal saját témája és elrendezései
|   |-- css/style.css      # Meglévő alprojekti alapstílusok
|   |-- js/main.js         # Rács/lista váltás és projektszámláló
|   `-- images/            # Képek, projekt-előnézetek
|-- projects/             # Önálló p5.js alprojektek
|   `-- README.md          # Az alprojektek elhelyezése
|-- .gitignore
`-- .nojekyll              # Statikus fájlok kiszolgálása Jekyll nélkül
```

## Helyi megnyitás

Nyisd meg az `index.html` fájlt a böngészőben. A projektkártyák a demókat új lapon nyitják meg, így a portfólió görgetési helyzete és kiválasztott nézete megmarad. A demó lapjának bezárásával vagy a portfólió lapjára váltással térhetsz vissza. A böngésző szokásos linkműveletei is használhatók, például a helyi menüből az azonos lapon megnyitás.

Nincs telepítési vagy buildlépés. A főoldal nem használ külső betűtípust, CSS-keretrendszert vagy p5.js-t; a képek és stílusok helyi fájlok. Az alprojektek CDN-ről betöltött függőségeihez internetkapcsolat szükséges.

A fájlokat betöltő p5.js projektekhez (például `loadJSON`, `loadImage`, modulok) használj helyi HTTP-szervert, például a VS Code Live Server bővítményét. A `file://` megnyitás ezeknél böngészőkorlátozásokba ütközhet.

## Új alprojekt hozzáadása

1. Másold a kész projektet a `projects/<projekt-neve>/` mappába.
2. Legyen saját `index.html` belépőoldala, és maradjanak együtt a saját erőforrásai.
3. Az `index.html` fájl `#project-grid` elemében másolj le egy teljes `article.project-card` blokkot. Add meg a projekt relatív hivatkozását, nevét, rövid leírását és címkéit.
4. Helyezd el az előnézetet az `assets/images/` mappában, és frissítsd a kép útvonalát, leíró `alt` szövegét, valamint valódi szélességét és magasságát. A megjelenítés mindig négyzetes, középre vágott (`aspect-ratio: 1`, `object-fit: cover`); az eredeti képet nem kell átméretezni.
5. A cím és a megnyitási felirat `id` értékei legyenek egyediek, az `aria-labelledby` ezekre mutasson. Frissítsd a képen lévő sorszámot és témát is. Az új kártyák képeihez használj `loading="lazy"` beállítást; `fetchpriority="high"` csak a legelső képen legyen.

A kártyák hagyományos HTML-hivatkozások, JavaScript nélkül is használhatók. A `target="_blank" rel="noopener"` és az új lapot jelző felirat maradjon meg minden demónál. A darabszámot a JavaScript automatikusan frissíti; a HTML-ben lévő tartalék darabszámot is igazítsd az új mennyiséghez.

## Megjelenés és ellenőrzés

- A színeket, térközöket, kártyaméretet és lekerekítéseket az `assets/css/landing.css` elején lévő CSS-változók szabályozzák. A főoldal nem tölti be az alprojektek által is használt `style.css` fájlt.
- A **Rács / Lista** gombok ugyanazt a kártyagyűjteményt rendezik át; nincs két külön karbantartandó projektlista. A rács automatikusan alkalmazkodik a szélességhez és 10–15 projekthez is. A `--card-min-width`, `--card-gap` és a `.workspace` oszlopai változtathatók az elrendezés kipróbálásához.
- A nézetváltó csak működő JavaScript mellett jelenik meg. A nézet az aktuális lapon marad meg, újratöltéskor visszaáll rácsra; nincs böngészőtárhely vagy cookie.
- Az előnézetek jelenleg statikus helykitöltő képek, finom hover-effekttel; nincs GIF, videó vagy a háttérben futó szimuláció.
- Ellenőrzéskor próbáld ki mindkét nézetet mobil- és asztali szélességen, a billentyűzetes navigációt, a csökkentett mozgás beállítást és az új lapos demómegnyitást. Automatikus teszt- vagy buildrendszer jelenleg nincs.

További részletek: [projects/README.md](projects/README.md).

## Közzététel GitHub Pages-en

1. Hozz létre egy GitHub-repozitóriumot, majd töltsd fel ide a projektet.
2. A repozitórium **Settings > Pages** oldalán válaszd a **Deploy from a branch** lehetőséget.
3. Forrásként állítsd be a `main` ágat és a `/(root)` mappát, majd mentsd el.

A publikáláshoz először legalább egy commitnak lennie kell a `main` ágon. A projekt inicializálása még nem hoz létre commitot vagy GitHub-repozitóriumot.

A webhely szokásos címe: `https://<felhasznalonev>.github.io/<repo-neve>/`. Minden belső útvonal legyen relatív, kezdő `/` nélkül, hogy a repozitórium neve alatti kiszolgálás is működjön. A fájlnevek kis- és nagybetűi egyezzenek a hivatkozásokkal.