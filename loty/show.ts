var passengers = document.querySelectorAll(".passenger-list > li");

interface Passenger {
  dataset: {
    identyfikatorPasazera: string;
  }
}

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
