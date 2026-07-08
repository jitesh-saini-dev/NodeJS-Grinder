// let arr = [100, -200, 300, -400, -800];
// let negarr = (arr) => {
//   return arr.filter((x) => x < 0);
// };
// console.log(negarr(arr));

// console.log(ans);
// let ans = 5;

function countdown(n) {
  if (n === 0) {
    return; // Base case
  }

  console.log(n);
  countdown(n - 1); // Recursive call
}

countdown(5);
