import * as sqlite from 'sqlite3';

export async function createMemeTablesIfNeeded(db: sqlite.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("START");
    db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name IN ('memes', 'history');`, (err, rows) => {
      if (err) {
        reject('DB Error');
        return;
      }

      if (rows[0].cnt === 2) {
        console.log('Database tables already exist.');
        resolve();
        return;
      }

      console.log('Creating database tables...');
      db.run(`
        CREATE TABLE history (
          meme_id INTEGER NOT NULL,
          price INTEGER NOT NULL,
          created_at REAL NOT NULL
        )
        `, [], (err: any) => {
          if (err) {
            reject('DB Error');
            return;
          }
        db.run(`
        CREATE INDEX history_time_idx
          ON history(created_at)
        `, [], (err: any) => {
          if (err) {
            reject('DB Error');
            return;
          }
          db.run(`
            CREATE TABLE memes (
              id INTEGER PRIMARY KEY,
              name TEXT NOT NULL,
              url TEXT NOT NULL,
              price INTEGER NOT NULL)`
            , [], (err: any) => {
              if (err) {
                reject('DB Error');
                return;
              }
              console.log('Done.');

              memesInit(db);
              resolve();
            });
        });
      });
    });
  });
}

function memeFromRow(row) : Meme {
  return new Meme(row.id, row.name, row.url, row.price);
}

export function getMeme(db: sqlite.Database, id: number): Promise<Meme | undefined> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM memes WHERE id = ?', [id], (err,row) => {
      if (err) {
        reject(err);
        return;
      }
      if (!row) {
        resolve(undefined);
      } else {
        resolve(memeFromRow(row));
      }
    });
  });
}


export default class Meme {
  private id: number;
  private name: string;
  private file_name: string;
  private price : number;


  constructor(id: number, name : string, file_name : string, price : number) {
    this.id = id;
    this.name = name;
    this.file_name = file_name;
    this.price = price;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getPrice() {
    return this.price;
  }

  getFileName() {
    return this.file_name;
  }

  getHistory(db: sqlite.Database) : Promise<number[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT price FROM history WHERE meme_id = ? ORDER BY created_at DESC', [this.id], (err,row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row.map(obj => obj.price));
      });
    });
  }

  setPrice(db: sqlite.Database, new_price: number) {
    if (new_price == this.price || new_price < 0) return;
    const old_price = this.price;
    this.price = new_price;

    db.exec("BEGIN");
    db.run(`INSERT INTO history (meme_id, price, created_at) VALUES(?, ?, date('now'))`,
      [this.id, old_price], (err, row) => {
      if (err) {
        db.exec("ROLLBACK");
        this.price = old_price;
        return;
      }
      db.run(`
        UPDATE memes SET price = ? WHERE id = ?;`,
        [new_price, this.id], (err, row) => {
        if (err) {
          db.exec("ROLLBACK");
          this.price = old_price;
          return;
        }
        db.exec("COMMIT");
      });
    });
  }
}

export function newMeme(db: sqlite.Database, name: string, url: string, price: number) {
  db.run(`INSERT INTO memes (name, url, price) VALUES(?, ?, ?)
  `, [name, url, price], (err, row) => {});
}

function memesInit(db: sqlite.Database) {
  newMeme(db, "42", "42.jpg", 42);
  newMeme(db, "Cyberksio", "cyberpunk.png", 13);
  newMeme(db, "Frontend", "frontend.png", 1023);
  newMeme(db, "Before and after", "math.jpg", 1);
  newMeme(db, "Teoria mnogosci", "mnogosc.jpg", 412);
  newMeme(db, "Piasek", "plaza.jpg", 551);
  newMeme(db, "Perspektywa bułki", "pov.png", 112);
  newMeme(db, "Papier toaletowy", "pqpi34.jpg", 152);
  newMeme(db, "Sratch chad", "scratch.png", 1020);
  newMeme(db, "Vim", "vim.png", 0);
  newMeme(db, "Bledy kompilacji", "znowu_oni.png", 1822);
}

export function getBest(db: sqlite.Database) : Promise<Meme[]> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM memes ORDER BY price DESC LIMIT 3`, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.map(r => memeFromRow(r)));
    });
  });
}

export function allMemes(db: sqlite.Database) : Promise<Meme[]> {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM memes`, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.map(r => memeFromRow(r)));
    });
  });
}