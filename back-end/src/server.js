

// Server routers
const express = require("express");
const app = express();

// base url

const BASE = `/api`

app.use(express.json());


const adminRoutes = require("./routes/adminRoutes");
app.use(BASE + "/admin", adminRoutes);


const reserveRoute = require("./routes/reserveRoutes");
app.use(BASE, reserveRoute);

const newSessionRoute = require("./routes/newSessionRoutes");
app.use(BASE, newSessionRoute);

app.listen(9876, () => {
  console.log("Server running at http://localhost:9876");
});