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
var fail_modal = document.querySelector('#fail_modal');
var modal_msg = document.querySelector('#fail_modal #modal-message');
var fname = document.querySelector('input[name=fname]');
var lname = document.querySelector('input[name=lname]');
var fdate = document.querySelector('input[name=flight-date]');
var sbtn = document.querySelector('input[type=submit]');
sbtn.addEventListener("click", function (e) { return checkForm(e); });
fail_modal.addEventListener("click", function (e) { return hideFormMsg(); });
function checkForm(e) {
    var date = new Date(fdate.value);
    var now = new Date();
    if (fname.value == "" || lname.value == "") {
        failFormMsg("Proszę wypełnić pola z imieniem i nazwiskiem!", e);
        return;
    }
    if (fdate.value == "") {
        failFormMsg("Proszę podać datę wylotu!", e);
        return;
    }
    if (date < now && date.toDateString() !== now.toDateString()) {
        failFormMsg("Nie sprzedajemy lotów w przeszłość!", e);
    }
}
function failFormMsg(s, e) {
    fail_modal.classList.remove('hidden');
    modal_msg.innerHTML = s;
    if (e !== undefined)
        e.preventDefault();
}
function hideFormMsg() {
    fail_modal.classList.add('hidden');
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
        console.log("No photo provided");
    }
    ceo_container.appendChild(photo);
});
console.log("Pe");
