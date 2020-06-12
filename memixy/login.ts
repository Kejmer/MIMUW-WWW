import * as sqlite from 'sqlite3';
import * as crypto from 'crypto';

export function createLoginTables(db: sqlite.Database) : Promise<void> {
  return new Promise((res, rej) => {
    db.all(`SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name = 'users';`, (err, rows) => {
      if (err) {
        rej('DB Error');
        return;
      }

      if (rows[0].cnt === 1) {
        console.log('User table exists.')
        res();
        return;
      }

      db.run(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY,
          username TEXT,
          hashed_pass TEXT
        )
        `, [], (err: any) => {
          if (err) {
            rej('DB Error');
            return;
          }
          usersInit(db);
          res();
        });
    });
  });
}

export function validateUsername(username: string) : boolean {
  return !!username.match(/^[0-9a-zA-Z]+$/);
}

function hashPassword(password: string) : string {
  return crypto.createHash('sha1').update(password).digest('hex');
}

export function newUser(db: sqlite.Database, username: string, password: string) : Promise<boolean> {
  return new Promise((res, rej) => {
    if (!validateUsername(username)) {
      res(false);
      return;
    }
    db.exec('BEGIN');

    let hashed = hashPassword(password);
    db.get(`SELECT 1 as one FROM 'users' WHERE username = ?`, [username], (err, row) => {
      if (row || err) { // konto już istnieje
        db.exec('ROLLBACK');
        res(false);
        return;
      }
      db.run(`INSERT INTO users (username, hashed_pass) VALUES(?,?)`, [username, hashed], (err: any) => {
        if (err)
          db.exec('ROLLBACK');
        else
          db.exec('COMMIT');
        res(!err);
      })
    })
  })
}

export function login(db: sqlite.Database, username: string, password: string) : Promise<boolean> {
  return new Promise((res, rej) => {
    if (!validateUsername(username)) {
      res(false);
      return;
    }

    let hashed = hashPassword(password);
    db.get(`SELECT 1 as one FROM 'users' WHERE username = ? AND hashed_pass = ?`, [username, hashed], (err, row) => {
      res(!err && !!row);
    })
  })
}

function usersInit(db: sqlite.Database) {
  newUser(db, "admin", "admin");
  newUser(db, "user", "user");
}

