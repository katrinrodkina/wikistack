
const layout = require("./layout");

module.exports = (error) => layout(`
<hr> <hr>
  <h1>Ops, server error</h1>
  <h2>${error.message}</h2>
  <pre>${error.stack}</pre>
`);