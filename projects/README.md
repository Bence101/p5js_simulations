# p5.js alprojektek

Ide kerülnek a már elkészült, önálló projektek, mindegyik külön mappába.

Példa az elvárt elrendezésre (a példa nincs létrehozva):

```text
projects/
`-- flow-field/
    |-- index.html
    |-- sketch.js
    `-- assets/
```

- Használj rövid, ékezet és szóköz nélküli, kötőjeles mappaneveket.
- Minden projektnek legyen saját `index.html` fájlja, amely betölti a szükséges p5.js verziót és egyéb függőségeket.
- A projekten belüli erőforrásokra relatív útvonallal hivatkozz, például `./assets/image.png`.
- A portfólió főoldaláról például a `./projects/flow-field/` útvonalra lehet majd hivatkozni.
- Az előnézeti képek helye a gyökérben lévő `assets/images/` mappa.
- GitHub Pages csak statikus tartalmat szolgál ki; szerveroldali kódot igénylő projektekhez külön szolgáltatás szükséges.