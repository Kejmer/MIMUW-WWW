function zaloguj(...komunikaty: string[]) {
    console.log("Ależ skompilowany program!", ...komunikaty)
}

zaloguj("Ja", "cię", "nie", "mogę");

let jsonString: string = `{
    "piloci": [
        "Pirx",
        "Exupery",
        "Idzikowski",
        "Główczewski"
    ],
    "lotniska": {
        "WAW": ["Warszawa", [3690, 2800]],
        "NRT": ["Narita", [4000, 2500]],
        "BQH": ["Biggin Hill", [1802, 792]],
        "LBG": ["Paris-Le Bourget", [2665, 3000, 1845]]
    }
}`;

type Pilot = string;

interface ILotnisko {
    [code: string]: [string, number[]];
}

class ILiniaLotnicza {
    piloci: Pilot[];
    lotniska: ILotnisko[];
}

function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza {
    return dane.piloci !== undefined && dane.lotniska !== undefined
}

let daneLiniiLotniczej : ILiniaLotnicza = JSON.parse(jsonString);
console.log(daneLiniiLotniczej);
