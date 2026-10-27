# p5.js portfólió

Statikus portfólióoldal önálló p5.js projektek bemutatásához. A projekt jelenleg csak váz: a megjelenés és a projektlista később készül el.

## Technológia

- HTML, CSS és natív JavaScript.
- Nincs framework, buildlépés vagy backend.
- GitHub Pages-en közvetlenül közzétehető.
- A p5.js függőséget az egyes alprojektek saját maguk kezelik; a portfólió főoldala nem tölti be.

## Mappaszerkezet

```text
.
|-- index.html             # A portfólió későbbi főoldala
|-- assets/
|   |-- css/style.css      # Közös megjelenés
|   |-- js/main.js         # A főoldal későbbi interakciói
|   `-- images/            # Képek, projekt-előnézetek
|-- projects/             # Önálló p5.js alprojektek
|   `-- README.md          # Az alprojektek elhelyezése
|-- .gitignore
`-- .nojekyll              # Statikus fájlok kiszolgálása Jekyll nélkül
```

## Helyi megnyitás

Nyisd meg az `index.html` fájlt a böngészőben, majd kattints a **Bouncing Ball** hivatkozásra. A demó automatikusan elindul. Közvetlenül is megnyitható: [Bouncing Ball](projects/bouncing-ball/index.html).

Nincs telepítési vagy buildlépés. A demóhoz internetkapcsolat szükséges, mert a p5.js rögzített verziója CDN-ről töltődik be.

A fájlokat betöltő p5.js projektekhez (például `loadJSON`, `loadImage`, modulok) használj helyi HTTP-szervert, például a VS Code Live Server bővítményét. A `file://` megnyitás ezeknél böngészőkorlátozásokba ütközhet.

## Új alprojekt hozzáadása

1. Másold a kész projektet a `projects/<projekt-neve>/` mappába.
2. Legyen saját `index.html` belépőoldala, és maradjanak együtt a saját erőforrásai.
3. A főoldalról relatív hivatkozással mutass rá, például `./projects/flow-field/`.

További részletek: [projects/README.md](projects/README.md).

## Közzététel GitHub Pages-en

1. Hozz létre egy GitHub-repozitóriumot, majd töltsd fel ide a projektet.
2. A repozitórium **Settings > Pages** oldalán válaszd a **Deploy from a branch** lehetőséget.
3. Forrásként állítsd be a `main` ágat és a `/(root)` mappát, majd mentsd el.

A publikáláshoz először legalább egy commitnak lennie kell a `main` ágon. A projekt inicializálása még nem hoz létre commitot vagy GitHub-repozitóriumot.

A webhely szokásos címe: `https://<felhasznalonev>.github.io/<repo-neve>/`. Minden belső útvonal legyen relatív, kezdő `/` nélkül, hogy a repozitórium neve alatti kiszolgálás is működjön. A fájlnevek kis- és nagybetűi egyezzenek a hivatkozásokkal.