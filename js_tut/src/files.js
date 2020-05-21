var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from 'fs';
import { promisify } from 'util';
let open = promisify(fs.open);
let write = promisify(fs.write);
let close = promisify(fs.close);
fs.open('plik.txt', 'a', (err, fd) => {
    if (err) {
        console.log('Nie udało się otworzyć pliku :(', err);
        return;
    }
    fs.write(fd, 'Kolejny wpis do pliku!\n', (err, written, str) => {
        if (err) {
            console.log('Nie udało się zapisać', err);
        }
        fs.close(fd, () => { });
    });
});
let fd;
open('plik.txt', 'a').then((_fd) => {
    fd = _fd;
    write(fd, 'A z promisami też się może zapisze?\n');
}).then(() => close(fd)).catch((reason) => {
    console.log('Błąd był straszliwy!', reason);
});
zapiszCos();
function zapiszCos() {
    return __awaiter(this, void 0, void 0, function* () {
        let fd = -1;
        try {
            fd = yield open('plik.txt', 'a');
            yield write(fd, 'To jeszcze z async/await');
            yield close(fd);
        }
        catch (e) {
            console.log('Jakiś błąd w trakcie zapisywania', e);
            if (fd != -1) {
                yield close(fd);
            }
        }
    });
}
