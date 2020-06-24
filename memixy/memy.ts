import * as sqlite from 'sqlite3';
import {openDB, dbRun, dbBegin, dbEnd, dbClose, sleep} from './db_handler';

function memeFromRow(row) : Meme {
  return new Meme(row.id, row.name, row.url, row.price, row.last_updator);
}

export function getMeme(id: number): Promise<Meme | undefined> {
  let db = openDB();
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
    db.close();
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

  getHistory() : Promise<number[]> {
    let db = openDB();
    return new Promise((resolve, reject) => {
      db.all('SELECT price, author FROM history WHERE meme_id = ? ORDER BY created_at DESC', [this.id], (err,row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
      db.close();
    });
  }

  async _setPrice(new_price: number, author: string, res, rej, tries) {
    let db = openDB()
    try {
      await dbBegin(db);
      await dbRun(db, `INSERT OR ROLLBACK INTO history (meme_id, price, created_at, author) VALUES(?, ?, date('now'), ?)`, [this.id, this.price, this.updator]);
      await dbRun(db, `UPDATE OR ROLLBACK memes SET price = ?, last_updator = ? WHERE id = ?`, [new_price, author, this.id]);
      await dbEnd(db);
      await dbClose(db);
      this.price = new_price;
      this.updator = author;
      res();
      return;
    } catch(err) {
      db.close();
      console.log(err);
      if (err.errno === 5 && tries > 0) {
        await sleep(1000)
        this._setPrice(new_price, author, res, rej, tries - 1);
      }
      rej(err);
    }
  }

  setPrice(new_price: number, author: string) : Promise<void> {
    return new Promise(async (res, rej) => {
      if (new_price == this.price || new_price < 0) {
        res();
        return;
      }
      this._setPrice(new_price, author, res, rej, 10);
    });
  }
} // class end


export function newMeme(name: string, url: string, price: number, author: string) : Promise<void> {
  return new Promise((res, rej) => {
    let db = openDB();
    db.run(`INSERT INTO memes (name, url, price, last_updator) VALUES(?, ?, ?, ?)
    `, [name, url, price, author], (err, row) => {
      if (err) rej(err);
      res();
      db.close();
    });
  })
}

export function memesInit() {
  newMeme("42", "42.jpg", 42, "admin");
  newMeme("Cyberksio", "cyberpunk.png", 13, "admin");
  newMeme("Frontend", "frontend.png", 1023, "admin");
  newMeme("Before and after", "math.jpg", 1, "admin");
  newMeme("Teoria mnogosci", "mnogosc.jpg", 412, "admin");
  newMeme("Piasek", "plaza.jpg", 551, "admin");
  newMeme("Perspektywa bułki", "pov.png", 112, "admin");
  newMeme("Papier toaletowy", "pqpi34.jpg", 152, "admin");
  newMeme("Sratch chad", "scratch.png", 1020, "admin");
  newMeme("Vim", "vim.png", 0, "admin");
  newMeme("Bledy kompilacji", "znowu_oni.png", 1822, "admin");
}

export function getBest() : Promise<Meme[]> {
  let db = openDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM memes ORDER BY price DESC LIMIT 3`, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.map(r => memeFromRow(r)));
    });
    db.close();
  });
}

export function allMemes() : Promise<Meme[]> {
  let db = openDB();
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM memes`, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.map(r => memeFromRow(r)));
    });
    db.close();
  });
}