

// Server routers
 
const express = require("express");
const app = express();

// base url

const BASE = `/api`

app.use(express.json());


const adminRoutes = require("./routes/adminRoutes");


app.use(BASE + "/admin", adminRoutes);

app.listen(9876, () => {
  console.log("Server running at http://localhost:9876");
});