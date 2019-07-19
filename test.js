//"use strict";

console.log("Success");

console.log(!!undefined);

function f(e = es()) {
  console.log(`function works and param is ${e}`);
}

function es() {
  //console.log("function didn't work");
  return "NewRetroWave";
}

f("Michael");
f();

let a = [];
