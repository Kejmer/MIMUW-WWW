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
      db.serialize(() => {
        db.run(`
          CREATE TABLE history (
            meme_id INTEGER NOT NULL,
            price INTEGER NOT NULL,
            created_at REAL NOT NULL,
            author TEXT
          )
          `, [], (err: any) => {
            if (err) {
              reject('DB Error');
              return;
            }
          });
        db.run(`
        CREATE INDEX history_time_idx
          ON history(created_at)
        `, [], (err: any) => {
          if (err) {
            reject('DB Error');
            return;
          }
        });
        db.run(`
          CREATE TABLE memes (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            url TEXT NOT NULL,
            price INTEGER NOT NULL,
            last_updator TEXT
          )`
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
}

function memeFromRow(row) : Meme {
  return new Meme(row.id, row.name, row.url, row.price, row.last_updator);
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
  private updator : string;

  constructor(id: number, name : string, file_name : string, price : number, updator: string) {
    this.id = id;
    this.name = name;
    this.file_name = file_name;
    this.price = price;
    this.updator = updator;
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

  getUpdator() {
    return this.updator;
  }

  getHistory(db: sqlite.Database) : Promise<number[]> {
    return new Promise((resolve, reject) => {
      db.all('SELECT price, author FROM history WHERE meme_id = ? ORDER BY created_at DESC', [this.id], (err,row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }


  setPrice(db: sqlite.Database, new_price: number, author: string) : Promise<void> {
    return new Promise((resolve, reject) => {
    if (new_price == this.price || new_price < 0) {
      resolve();
      return;
    }
    const old_price = this.price;
    const old_author = this.updator;
    this.price = new_price;
    this.updator = author;


    db.serialize(() => {
      db.run("BEGIN EXCLUSIVE");

      db.run(`INSERT INTO history (meme_id, price, created_at, author) VALUES(?, ?, date('now'), ?)`,
        [this.id, old_price, old_author], (err, row) => {
        if (err) {
          resolve();
          db.run("ROLLBACK");
          this.price = old_price;
          this.updator = old_author;
          return;
        }
      });

      db.run(`
        UPDATE memes SET price = ?, last_updator = ? WHERE id = ?;`,
        [new_price, author, this.id], (err, row) => {
        if (err) {
          resolve();
          db.run("ROLLBACK");
          this.price = old_price;
          this.updator = old_author;
          return;
        }
      });
      db.run("COMMIT");
      resolve();
    });
    })
  }
}

export function newMeme(db: sqlite.Database, name: string, url: string, price: number, author: string) {
  db.run(`INSERT INTO memes (name, url, price, last_updator) VALUES(?, ?, ?, ?)
  `, [name, url, price, author], (err, row) => {});
}

function memesInit(db: sqlite.Database) {
  newMeme(db, "42", "42.jpg", 42, "admin");
  newMeme(db, "Cyberksio", "cyberpunk.png", 13, "admin");
  newMeme(db, "Frontend", "frontend.png", 1023, "admin");
  newMeme(db, "Before and after", "math.jpg", 1, "admin");
  newMeme(db, "Teoria mnogosci", "mnogosc.jpg", 412, "admin");
  newMeme(db, "Piasek", "plaza.jpg", 551, "admin");
  newMeme(db, "Perspektywa bułki", "pov.png", 112, "admin");
  newMeme(db, "Papier toaletowy", "pqpi34.jpg", 152, "admin");
  newMeme(db, "Sratch chad", "scratch.png", 1020, "admin");
  newMeme(db, "Vim", "vim.png", 0, "admin");
  newMeme(db, "Bledy kompilacji", "znowu_oni.png", 1822, "admin");
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