
// Fake db connection check (for now) 
function checkDBConnection() {
    return false;
}
    const { buildErrorLog } = require("../utils");


exports.healthcheck = (req, res) => {

    const db_state = checkDBConnection();

    if (!db_state) {

        return res.status(400).json(buildErrorLog(req, 400, "Couldn`t reach the database", "Go look at the Database"));

        };
    
    res.status(200).json({
        status: "OK",
        dbconnection: "Database is Up and Running",
        n_charge_points: 0,
        n_charge_points_online: 0,
        n_charge_points_offline: 0
    });

};