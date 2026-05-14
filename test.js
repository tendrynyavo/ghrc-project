// test.js  (runs with: node test.js)
const assert = console.assert;

async function run(method, path, body) {
  const res = await fetch(`http://localhost:3000${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
}

async function tests() {
  let { status, data } = await run("GET", "/health");
  assert(status === 200, "health check should return 200");
  assert(data.status === "ok", "health status should be ok");

  ({ status, data } = await run("GET", "/todos"));
  assert(status === 200, "GET /todos should return 200");
  assert(Array.isArray(data), "todos should be an array");

  ({ status, data } = await run("POST", "/todos", { task: "Write tests" }));
  assert(status === 201, "POST /todos should return 201");
  assert(data.task === "Write tests", "task name should match");

  ({ status } = await run("DELETE", `/todos/${data.id}`));
  assert(status === 200, "DELETE should return 200");

  console.log("All tests passed!");
}

tests().catch(err => { 
    console.error(err); 
    process.exit(1); 
});