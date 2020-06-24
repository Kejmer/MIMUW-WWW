import * as sqlite from 'sqlite3';
import * as crypto from 'crypto';
import {openDB, dbRun, dbBegin, dbEnd, dbClose, sleep} from './db_handler';

export function validateUsername(username: string) : boolean {
  return !!username.match(/^[0-9a-zA-Z]+$/) && username !== "";
}

function hashPassword(password: string) : string {
  return crypto.createHash('sha1').update(password).digest('hex');
}

async function _newUser(username, hashed, res, rej, tries) {
  let db = openDB();

  try {
    await dbBegin(db);
    await dbRun(db, 'INSERT OR ROLLBACK INTO users (username, hashed_pass) VALUES(?,?)', [username, hashed]);
    await dbEnd(db);
    await dbClose(db);
    res(true);
    return;
  } catch(err) {
    db.close();
    console.log(err);
    if (err.errno === 5 && tries > 0) {
      await sleep(1000)
      _newUser(username, hashed, res, rej, tries - 1);
    }
    else if (err.errno === 19)
      res(false);
    else
      rej(err);
  }
}

export function newUser(username: string, password: string) : Promise<boolean> {
  return new Promise((res, rej) => {
    if (!validateUsername(username)) {
      res(false);
      return;
    }
    const hashed = hashPassword(password);
    // unikalność gwarantowana przez index
    _newUser(username, hashed, res, rej, 1)
  })
}

export function login(username: string, password: string) : Promise<boolean> {
  return new Promise((res, rej) => {
    if (!validateUsername(username)) {
      res(false);
      return;
    }
    let db = openDB();

    let hashed = hashPassword(password);
    db.get(`SELECT 1 as one FROM 'users' WHERE username = ? AND hashed_pass = ?`, [username, hashed], (err, row) => {
      if (err) {
        rej(err);
        return;
      }
      res(!!row);
    });
    db.close();
  })
}

export function usersInit() {
  newUser("admin", "admin")
  newUser("user", "user")
}

