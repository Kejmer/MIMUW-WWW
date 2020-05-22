import * as sqlite3 from "sqlite3";

const db_name = "memgazyn.db";

function errHandler(err) {
  if (err) throw(err);
}
// created_at TEXT DEFAULT CURRENT_TIMESTAMP
function logHistory(price: number, id: number) {
  return `INSERT INTO history (meme_id, price, updated_at) VALUES ${id}, ${price}, dzisiaj`;
}

function insertMeme(name : string, file_name : string, price : number) : string {
  return `INSERT INTO memes (name, file_name, price) VALUES "${name}", "public/images/${file_name}", "${price}";`;
}

function dbSetup() { // PRZEROBIĆ NA SERIALIZE
  sqlite3.verbose();
  let db = new sqlite3.Database(db_name);
  db.get('SELECT name FROM sqlite_master WHERE type="table" AND name = "memes"', [], (err, row) => {
    errHandler(err);
    if (!row) {
      db.close();
      return;
    }
    let schema = "CREATE TABLE memes (id INT PRIMARY KEY AUTOINCREMENT, name VARCHAR(255), file_name VARCHAR(255), price INT);";
    schema += insertMeme("42", "42.jpg", 42);
    schema += insertMeme("Cyberksio", "cyberpunk.png", 13);
    schema += insertMeme("Frontend", "frontend.png", 1023);
    schema += insertMeme("Before and after", "math.jpg", 1);
    schema += insertMeme("Teoria mnogosci", "mnogosc.jpg", 412);
    schema += insertMeme("Piasek", "plaza.jpg", 551);
    schema += insertMeme("Perspektywa bułki", "pov.png", 112);
    schema += insertMeme("Papier toaletowy", "pqpi34.jpg", 152);
    schema += insertMeme("Sratch chad", "scratch.png", 1020);
    schema += insertMeme("Vim", "vim.png", 0);
    schema += insertMeme("Bledy kompilacji", "znowu_oni.png", 1822);


    db.run(schema);
  });
}

function getMeme(id: number) {
  sqlite3.verbose();
  let db = new sqlite3.Database(db_name);
  let done : boolean = false;
  let result; // ogarnąć obiektowość
  db.get('SELECT * from memes WHERE id = ?', [id], (err, row) => {
    errHandler(err);
    if (!row) throw("NO MEME");
    result = row;
    done = true;
  });
  while (!done);
  return result;
}

dbSetup();