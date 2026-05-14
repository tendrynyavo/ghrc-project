// A dead-simple test (no framework needed)
function add(a, b) { return a + b; }

console.assert(add(2, 3) === 5, "add() should return 5");
console.assert(add(0, 0) === 0, "add() should return 0");

console.log("✅ All tests passed!");