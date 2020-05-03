var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var modal_msg_success = document.querySelector('#success_modal #modal-message');
var modal_msg_fail = document.querySelector('#fail_modal #modal-message');
var dest = document.querySelector('select[name=destination]');
var fdate = document.querySelector('input[name=flight-date]');
var success_modal = document.querySelector('#success_modal');
var sbtn = document.querySelector('input[type=submit]');
var fname = document.querySelector('input[name=fname]');
var lname = document.querySelector('input[name=lname]');
var from = document.querySelector('select[name=from]');
var fail_modal = document.querySelector('#fail_modal');
success_modal.addEventListener("click", function (e) { return hideSuccessMsg(); });
fail_modal.addEventListener("click", function (e) { return hideFailMsg(); });
sbtn.addEventListener("click", function (e) { return checkForm(e); });
function validName() {
    return fname.value != "" && lname.value != "";
}
function existDate() {
    return fdate.value != "";
}
function validDate() {
    var date = new Date(fdate.value);
    var now = new Date();
    return existDate() && (date > now || date.toDateString() == now.toDateString());
}
function validFlight() {
    return from.value != "" && dest.value != "" && dest.value != from.value;
}
function validForm() {
    return validDate() && validName() && validFlight();
}
function checkForm(e) {
    if (!validName()) {
        failFormMsg("Proszę wypełnić pola z imieniem i nazwiskiem!", e);
        return;
    }
    if (!existDate()) {
        failFormMsg("Proszę podać datę wylotu!", e);
        return;
    }
    if (!validDate()) {
        failFormMsg("Nie sprzedajemy lotów w przeszłość!", e);
        return;
    }
    successFormMsg("Rezerwacja złożona pomyślnie!", e);
}
function failFormMsg(s, e) {
    fail_modal.classList.remove('hidden');
    modal_msg_fail.innerHTML = s;
    if (e !== undefined)
        e.preventDefault();
}
function successFormMsg(s, e) {
    success_modal.classList.remove('hidden');
    modal_msg_success.innerHTML = s;
    if (e !== undefined)
        e.preventDefault();
}
function hideFailMsg() {
    fail_modal.classList.add('hidden');
}
function hideSuccessMsg() {
    success_modal.classList.add('hidden');
}
var nowyElement = document.createElement("div");
nowyElement.innerText = "WOW TO DZIALA";
nowyElement.classList.add("middle", "big");
document.querySelector("body").appendChild(nowyElement);
setTimeout(function () {
    console.log('Minęły dwie sekundy');
}, 2000);
function wait(ms) {
    return new Promise(function (res) { return setTimeout(res, ms); });
}
function rainbowColors(el) {
    return __awaiter(this, void 0, void 0, function () {
        var colors, _i, colors_1, color;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('kolorki');
                    colors = ['red', 'orange', 'yellow', 'blue', 'indigo', 'purple'];
                    _i = 0, colors_1 = colors;
                    _a.label = 1;
                case 1:
                    if (!(_i < colors_1.length)) return [3 /*break*/, 4];
                    color = colors_1[_i];
                    return [4 /*yield*/, wait(1000)];
                case 2:
                    _a.sent();
                    // console.log(color);
                    el.style.background = color;
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var footer = document.querySelector('footer');
rainbowColors(footer);
function isCommit(object) {
    if (object.author === undefined)
        return false;
    return object.author.avatar_url !== undefined;
}
function getPhoto(commit) {
    return commit.author.avatar_url;
}
function isPhoto(object) {
    return object.src !== undefined;
}
var commit;
var ceo_container = document.querySelector("#ceo-container");
var photo;
fetch('https://api.github.com/repos/Kejmer/MIMUW-WWW/commits')
    .then(function (response) { return response.json(); })
    .then(function (data) {
    commit = data[0];
    if (isCommit(commit)) {
        photo = document.createElement('IMG');
        photo.classList.add("small-img");
        if (isPhoto(photo))
            photo.src = getPhoto(commit);
    }
    else {
        photo = document.createElement('p');
        photo.innerText = "No photo provided";
    }
    ceo_container.appendChild(photo);
});
// KROK 7
function randomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var right_col = document.querySelector('#delayed-flights');
var form = document.querySelector('#delayed-flights form');
var table = document.querySelector('#opoznienia');
right_col.addEventListener("click", function (e) { return rightBackground2(e); });
//używając event.target
function rightBackground(e) {
    var node = e.target;
    if (node.contains(table) || node.contains(form))
        right_col.style.backgroundColor = randomColor();
}
//nie używając
var clicksCntr = 0;
form.addEventListener("click", function (e) {
    e.stopPropagation();
});
function rightBackground2(e) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            clicksCntr++;
            console.log(fib(clicksCntr * 10));
            right_col.style.background = randomColor();
            return [2 /*return*/];
        });
    });
}
//fibonaci
var fibMem = {};
function fib(i) {
    if (i in fibMem)
        return fibMem[i];
    if (i <= 2)
        return i - 1;
    fibMem[i] = fib(i - 1) + fib(i - 2);
    return fibMem[i];
}
// obsługa submit
function checkSubmit() {
    sbtn.disabled = !validForm();
}
checkSubmit();
form.onchange = function () { return checkSubmit(); };
