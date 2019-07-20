"use strict";

/* 
 * flatten array using Depth-first Search
 * assuming elements in arr are either number or array
 */
function dfsFlatten(arr) {
  const res = [];
  dfs(arr, res);

  return res;
}

// helper function for dfsFlatten
function dfs(item, res) {
  if (typeof item === "number") {
    res.push(item);
    return ;
  }

  for (let i = 0; i < item.length; ++i) {
    dfs(item[i], res);
  }
}


/* 
 * flatten array using Breath-first Search
 * assuming elements in arr are either number or array
 */
function bfsFlatten(arr) {
  const res = [];
  const queue = arr;
  let item;

  while (queue.length) {
    item = queue.shift();
    if (typeof item === "number") {
      res.push(item);
    } else {
      queue.push(...item);
    }
  }

  return res;
}


const raw_input = [
  1,
  2,
  [3,4, [5,6,0]],
  4,
  [3,7],
  0
];

console.log("DFS:", dfsFlatten(raw_input)); // DFS: [ 1, 2, 3, 4, 5, 6, 0, 4, 3, 7, 0 ]
console.log("BFS:", bfsFlatten(raw_input)); // BFS: [ 1, 2, 4, 0, 3, 4, 3, 7, 5, 6, 0 ]