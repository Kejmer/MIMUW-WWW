var passengers = document.querySelectorAll(".passenger-list > li");

let biggest:any  = ""

interface Passenger {
  dataset: {
    identyfikatorPasazera: string;
  }
}

// function sprawdzDaneLiniiLotniczej(dane: any): dane is ILiniaLotnicza

function isPassenger(object: any): object is Passenger {
  return object.getAttribute("data-indetyfikator-pasazera") !== "undefined"
}

let passIdArr: Array<string> = []
passengers.forEach(
  function(child) {
    if (isPassenger(child))
      passIdArr.push(child.dataset.identyfikatorPasazera);
  }
);

passIdArr.sort().reverse();

console.log(passIdArr[0]);

// for(let child of passengers) {
//   // if (biggest < child.dataset.indentyfikatorPasazera) {
//     biggest = child;
//     console.log(child);
//     // console.log(child.dataset.identyfikatorPasazera);
//   // }
// }

// alert(biggest);