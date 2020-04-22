var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function zaloguj() {
    var komunikaty = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        komunikaty[_i] = arguments[_i];
    }
    console.log.apply(console, __spreadArrays(["Ależ skompilowany program!"], komunikaty));
}
zaloguj("Ja", "cię", "nie", "mogę");
var jsonString = "{\n    \"piloci\": [\n        \"Pirx\",\n        \"Exupery\",\n        \"Idzikowski\",\n        \"G\u0142\u00F3wczewski\"\n    ],\n    \"haha\" : 9,\n    \"lotniska\": {\n        \"WAW\": [\"Warszawa\", [3690, 2800]],\n        \"NRT\": [\"Narita\", [4000, 2500]],\n        \"BQH\": [\"Biggin Hill\", [1802, 792]],\n        \"LBG\": [\"Paris-Le Bourget\", [2665, 3000, 1845]]\n    }\n}";
var ILiniaLotnicza = /** @class */ (function () {
    function ILiniaLotnicza() {
    }
    return ILiniaLotnicza;
}());
// function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza {
// }
var daneLiniiLotniczej = JSON.parse(jsonString);
console.log(daneLiniiLotniczej);
