"use strict"

// ==== Native Filter ====
Array.prototype.filter = function(fn) {
  let res = [];
  let _arr = this;
  for (let i = 0; i < _arr.length; ++i) {
    if ( fn.call(this, _arr[i], i, _arr) ) {
      res.push(_arr[i]);
    }
  }
  
  return res; 
};

let filter_words = ['a', 'ab', 'bcd', 'asdf', 'asdfre', 'qwerre'];
let new_result = filter_words.filter(word => word.length > 3);
console.log('Filter: ', filter_words, "=>", new_result);

// ==== Native Map ====
Array.prototype.map = function(fn) {
  let res = [];
  let _arr = this;
  for (let i = 0; i < _arr.length; ++i) {
    res.push( fn.call(this, _arr[i], i, _arr) );
  }

  return res;
};

let map_array = [1, 4, 9, 16];
const new_map = map_array.map(x => x * 2);
console.log("Map:", map_array, "=>", new_map);

// ==== Native Reduce ====
Array.prototype.reduce = function(fn) {
  let _arr = this;
  let accum = _arr[0];
  for (let i = 1; i < _arr.length; ++i) {
    accum = fn(accum, _arr[i]);
  }

  return accum;
};

const reduce_array = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
console.log("Reduce:", reduce_array, "=>", reduce_array.reduce(reducer));

// ==== Native Debounce ====
function debounce(fn, wait) {
  let timeout_id;
  return function() {
    let context = this;
    let args = arguments;

    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      fn.apply(context,args);
    }, wait);
  };
}

let event = debounce(function() { console.log('Debounce Outputs'); }, 2000);
// event();
// event();
// event();

// ==== Native Throttle ====
function throttle(fn, limit) {
  let flag;
  let prev;
  let timeout_id;
  return function() {
    let context = this;
    let args = arguments;
    if (!flag) {
      fn.apply(context, args);
      flag = true;
      prev = Date.now();
      timeout_id = setTimeout(() => flag = false, limit);
    } else {
      clearTimeout(timeout_id);
      timeout_id = setTimeout(() => {
        flag = false;
        fn.apply(context, args);
      }, limit - (Date.now() - prev));
    }
  };
}

// let event2 = throttle(function() { console.log('Thrrottle Outputs'); }, 1000);
// for (let i = 0; i < 1000; ++i) {
//   event2();
// }

// ==== Native Bind ====
Function.prototype.bind = function() {
  let func = this;
  let context = arguments[0]; // new target ( obj )
  let prev_args = [].slice.call(arguments, 1); // previous arguments ( func: function(...args) )

  return function() {
    let cur_args = [].slice.call(arguments); // current arguments ( newf(...args) )
    let new_args = prev_args.concat(cur_args);
    return func.apply(context, new_args);
  };
};

// test case 1
let test = {
  v: "Michael",
  func: function() { // prev args
    console.log(this.v);
  }
};

test.func();
let obj = {v: "Abby"};
let newf = test.func.bind(obj);
newf(); // current args

// test case 2
let func = function(a, b) {
  return a + b
};

let boundFunc = func.bind(null, 'foo');
let result = boundFunc('aa', 'aa');
console.log(result);

// ==== printTasks ====
function _showTime() {
  return (new Date()).toLocaleTimeString();
}

function printTasks(list) {
  if (list.length === 1) {
    setTimeout(() => console.log(_showTime(), "=>", list[0]["Value"]), list[0]["Time"]);
    return ;
  }

  setTimeout(() => {
    console.log(_showTime(), "=>", list[0]["Value"]);
    printTasks( list.slice(1) );
  }, list[0]["Time"]);

}

let input = [
  {
    Value: "a",
    Time: 2000
  },
  {
    Value: "b",
    Time: 1000
  },
  {
    Value: "c",
    Time: 3000
  },
];

console.log(_showTime(), "printTasks Starts");
printTasks(input);