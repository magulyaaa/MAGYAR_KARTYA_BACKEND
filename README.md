## Magyar kártya játékok
### A projektről
---
>A Magyar Kártya játékok mint ahogyan a neve is árulkodó az egyik leghíresebb magyar kártyajátékok játszását teszi lehetővé.
Amennyiben még nem játszottál az elérhető játékok valamelyikével minden játékhoz van egy leírás/játkszabály ami segít a játék megértésében.
Egyenlőre még csak a gép/bot ellen lehet játszani de igyekszünk annak fejlesztésén, hogy más emberekkel is meg lehessen küzdeni.
Az animációk és a megjelenése a játéknak,valamint a legtöbb ember számára egy izgalmas és élvezhető dolog a kártyajáték
így van hogy nem tudjuk abba hagyni ennek érdekében végtelen lejátszható kört kínál az alkalmazás
---
## Készíttte
* Veres István (Backend, Sql Adatbázis)
* [Github Repository](https://github.com/magulyaaa/MAGYAR_KARTYA_BACKEND)
## Fejlesztési környezet
* Node.js
* MySql
---
## Adatbázis neve: magyar_kartya
## Táblák:
|cards| fajer_card | games | huszonegy_card | score_board | user | votes|
|-------|------------|-------|----------------|-------------|------|------|
|card_id|game_id|game_id|card_id|user_id|user_id|user_id|
|card_name|card_id|game_name|game_id|game_id|user_name|game_id|
|card_color|card_value||card_value|score|psw|
|card_img||||time|email|
|||||hearth|role|

---
### Sql terv amint látszik elég hiányos a mostani végleges adatbázishoz képest hiszen sok ötlettel és új dologgal bővült a projekt mire elértük a végleges formát
<img width="1081" height="551" alt="Képernyőkép 2026-04-27 152633" src="https://github.com/user-attachments/assets/62847215-d4c9-4b68-801c-e27c061a7501" />


---
## Backend
A backend Node.js alapú, Express keretrendszerrel, és MySQL adatbázissal működik. Feladata kommunikációs kapcsolatot létesíteni a frontend (játék + weboldal) és az adatbázis között.
## Telepítés és futtatás
```bash
git clone https://github.com/magulyaaa/MAGYAR_KARTYA_BACKEND.git
cd magyar_kartya_backend
npm install
npm run dev
---
Backend/
│
├── config/
│   └── dotenvConfig.js        # Környezeti változók (dotenv konfiguráció)
│
├── controllers/
│   ├── adminController.js     # Admin funkciók kezelése
│   ├── cardImgController.js   # Kártya képek kezelése
│   ├── fajerController.js     # (specifikus játék / logika controller)
│   ├── gameController.js      # Játék logika kezelése
│   ├── userController.js      # Felhasználói műveletek
│   └── voteController.js      # Szavazási rendszer kezelése
│
├── db/
│   └── db.js                  # Adatbázis kapcsolat konfiguráció
│
├── middleware/
│   ├── adminMiddleware.js     # Admin jogosultság ellenőrzés
│   ├── uploadMiddleware.js    # Fájl feltöltés kezelése
│   └── userMiddleWare.js      # Felhasználói autentikáció
│
├── models/
│   ├── cardImgModel.js        # Kártya képek adatmodell
│   ├── userModel.js           # Felhasználók adatmodellje
│   └── voteModel.js           # Szavazások adatmodellje
│
├── routes/
│   ├── adminRoutes.js         # Admin endpointok
│   ├── gameRoutes.js          # Játék API útvonalak
│   ├── uploadRoutes.js        # Feltöltés endpointok
│   ├── userRoutes.js          # Felhasználói route-ok
│   └── voteRoutes.js          # Szavazási route-ok
│
├── services/
│   └── deckService.js         # Pakli / deck logika
│
├── uploads/                   # Feltöltött fájlok
│
├── app.js                    # Express app konfiguráció
├── server.js                 # Szerver indítása
├── package.json              # Függőségek és script-ek
├── .gitignore                # Ignorált fájlok
└── README.md                 # Dokumentáció


## Használt package-ek

- bcryptjs
- cookie-parser
- cors
- dotenv
- express
- jsonwebtoken
- multer
- mysql2
- nodemon

---

## package.json dependencies


{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.0.2",
    "mysql2": "^3.17.2",
    "nodemon": "^3.1.11"
  }
}
```
---
## Biztonság
* JWT token alapú hitelesítés
* Jelszavak bcryptjs segítségével vannak hashelve
* Middleware szinten történik az authentikáció (auth.middleware.js)
* A .env fájl tartalmaz minden érzékeny adatot – ne oszd meg publikusan!
---

## 🧭 Végpontok
###Az app.js -be meghívtuk az összes routes fájlt amik kezelik a szükséges útvonalakat

```js
app.use('/game', express.static(path.join(__dirname, 'thegame')));

📌 Játék fájlok kiszolgálása (.exe, assetek)

app.use('/api/auth', authRoutes);

📌 Autentikáció (register, login, logout, whoami)

app.use('/api/user', userRoutes);

📌 Felhasználói adatok kezelése

app.use('/api/achievements', achievementRoutes);

📌 Achievement / eredmények kezelése

app.use('/api/forum', forumRoutes);

📌 Fórum posztok és kommentek

app.use('/api/friends', friendsRoutes);

📌 Barátlista kezelés

app.use('/api/game', gameRoutes);

📌 Játék logika API

🎮 Game / Játék funkciók
router.delete("/users/:user_id", auth, admin, deleteUser);

📌 Felhasználó törlése (admin)

router.post("/start", gameController.startGame);

📌 Játék indítása

router.post("/hit", gameController.hit);

📌 Kártya húzása

router.post("/stand", gameController.stand);

📌 Megállás

🔥 Fajer játék
router.post("/fajerStart", fajerController.fajerStart);

📌 Fajer játék indítása

router.post("/player-swap", fajerController.playerMove);

📌 Játékos lépés

router.post("/bot-swap", fajerController.botMove);

📌 Bot lépés

router.get("/result", fajerController.getResult);

📌 Eredmény lekérdezése

🖼️ Képfeltöltés
router.get('/getPicture', getAllpictures);

📌 Összes kép lekérése

router.post('/postPicture/:card_id', upload.single('pic'), postPicture);

📌 Kép feltöltése kártyához

👤 Auth / User
router.post('/register', register);

📌 Regisztráció

router.post('/login', login);

📌 Bejelentkezés

router.get('/whoami', auth, whoAmI);

📌 Aktuális user lekérdezése

router.post('/logout', logout);

📌 Kijelentkezés

router.get('/getAllUser', auth, admin, allUser);

📌 Összes user (admin)

router.put('/admin/edit/:user_id', auth, admin, editUser);

📌 User szerkesztése (admin)

router.delete('/admin/delete/:user_id', auth, admin, deleteUser);

📌 User törlése (admin)

🗳️ Szavazás
router.post('/:game_id', auth, vote);

📌 Szavazás egy játékra

router.delete('/:game_id', auth, unvote);

📌 Szavazat visszavonása

router.get('/results', getVotes);
```
---

## Admin művelet

| Művelet        | HTTP | Végpont        | Leírás |
|----------------|------|---------------|--------|
| Törlés   | DELETE | `/users/:user_id` | Egy felhasználó törlése DE CSAK ADMINKÉNT LEHETSÉGES! |

### 📋 Router definíciók
```js
router.delete("/users/:user_id",auth,admin, deleteUser)
```
---

## 🎮 Játék végpontok

### 🃏 21 játék

| Művelet        | HTTP | Végpont     | Leírás |
|----------------|------|------------|--------|
| Játék indítása | POST | `/start`   | Új 21 játék indítása |
| Lap húzás      | POST | `/hit`     | Új lap húzása |
| Megállás       | POST | `/stand`   | Kör befejezése |

### 🔥 Fajer játék

| Művelet        | HTTP | Végpont          | Leírás |
|----------------|------|------------------|--------|
| Játék indítása | POST | `/fajerStart`    | Fajer játék indítása |
| Játékos csere  | POST | `/player-swap`   | Játékos lépése |
| Bot csere      | POST | `/bot-swap`      | Bot lépése |
| Eredmény       | GET  | `/result`        | Játék eredmény lekérdezése |

### 📋 Router definíciók

```js
// 21 játék
router.post("/start", gameController.startGame);
router.post("/hit", gameController.hit);
router.post("/stand", gameController.stand);

// fajer játék
router.post("/fajerStart", fajerController.fajerStart);
router.post("/player-swap", fajerController.playerMove);
router.post("/bot-swap", fajerController.botMove);
router.get("/result", fajerController.getResult);
```
---

## 🖼️ Képek végpontok

| Művelet            | HTTP | Végpont                    | Leírás |
|--------------------|------|----------------------------|--------|
| Képek lekérdezése  | GET  | `/getPicture`              | Összes kép lekérdezése |
| Kép feltöltése     | POST | `/postPicture/:card_id`    | Kép feltöltése adott kártyához |

### 📋 Router definíciók

```js
router.get('/getPicture', getAllpictures);
router.post('/postPicture/:card_id', upload.single('pic'), postPicture);
```
---

## 👤 Felhasználó végpontok

| Művelet                | HTTP   | Végpont                    | Leírás |
|------------------------|--------|----------------------------|--------|
| Regisztráció           | POST   | `/register`                | Új felhasználó létrehozása |
| Bejelentkezés          | POST   | `/login`                   | Felhasználó bejelentkezése |
| Aktuális felhasználó   | GET    | `/whoami`                  | Bejelentkezett felhasználó adatai |
| Kijelentkezés          | POST   | `/logout`                  | Felhasználó kijelentkezése |
| Összes felhasználó     | GET    | `/getAllUser`              | Összes felhasználó lekérdezése (admin) |
| Felhasználó módosítása | PUT    | `/admin/edit/:user_id`     | Felhasználó szerkesztése (admin) |
| Felhasználó törlése    | DELETE | `/admin/delete/:user_id`   | Felhasználó törlése (admin) |

### 📋 Router definíciók

```js
router.post('/register', register);
router.post('/login', login);
router.get('/whoami', auth, whoAmI);
router.post('/logout', logout);
router.get('/getAllUser', auth, admin, allUser);
router.put('/admin/edit/:user_id', auth, admin, editUser);
router.delete('/admin/delete/:user_id', auth, admin, deleteUser);
```
---

## 🗳️ Szavazás végpontok

| Művelet        | HTTP   | Végpont         | Leírás |
|----------------|--------|-----------------|--------|
| Szavazás       | POST   | `/:game_id`     | Szavazás egy játékra |
| Szavazás törlés| DELETE | `/:game_id`     | Szavazat visszavonása |
| Eredmények     | GET    | `/results`      | Szavazások eredménye |

### 📋 Router definíciók

```js
router.post('/:game_id', auth, vote);
router.delete('/:game_id', auth, unvote);
router.get('/results', getVotes);
```
---
## Tesztelés
<img width="1281" height="801" alt="image" src="https://github.com/user-attachments/assets/61df93c7-41fb-44d9-ad93-a8c5f4ab5351" />

---
### A projekt jelenleg manuálisan tesztelt és tesztelhető a Postman segítségével.

---
## 🛠️ Használt Eszközök

* VS Code  
* MDN Web Docs  
* NPM  
* Postman  
* DrawSQL  
* W3Schools  
* StackOverflow  
* ChatGPT  
* Tabnine  
* GitHub  
* Google Drive  
* Pterodactyl  
* PhpMyAdmin  
* Miro  

