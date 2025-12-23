

const { pool } = require("../config/db");
const fs = require("fs");
const RESET_FILE = "./data/parts1234.json";

exports.initialisePoints = async () => {

    // Empty the tables to repopulate 
    await pool.query("TRUNCATE TABLE outlets, points, stations RESTART IDENTITY CASCADE");

    const raw = fs.readFileSync(RESET_FILE, "utf8");

    const stations = JSON.parse(raw);

    // Random values to initialise stations
    function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
    }

    const providers = ["Picachu", "Best Energy", "Bombastic Electric", "Zeus"]
    const prices = [0.4300, 0.5200, 0.4700, 0.5600]
    const caps = [20, 22, 50]
    const connectorType = ["CCS2" ,"CHAdeMO", "Type 2"];
    const pointStatus = ["available", "charging", "reserved", "malfunction", "offline"];
    const outletStatus = ["operational", "faulted"];


    for(const station of stations){

        const stationDetails =await pool.query(
            `INSERT INTO stations (id, lon, lat, address, name, provider, price_per_kwh)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
        [
            station.id,                 
            station.longitude,
            station.latitude,
            station.address,
            station.name,
            randomFrom(providers),
            randomFrom(prices)
        ]
        );

        const stationId = stationDetails.rows[0].id;
        for (const point of station.stations) {
            const pointDetails = await pool.query(
                `INSERT INTO points (id, station_id, cap, status)
                VALUES ($1, $2, $3, $4)
                RETURNING id`,
                [
                    point.id,                
                    stationId,
                    randomFrom(caps),
                    randomFrom(pointStatus)
                ]
            );

            const pointId = pointDetails.rows[0].id;
            for (const outlet of point.outlets) {
                const outletDetails = await pool.query(
                    `INSERT INTO outlets (id, point_id, type, status)
                    VALUES ($1, $2, $3, $4)`,
                    [
                        outlet.id,
                        pointId,
                        randomFrom(connectorType),
                        randomFrom(outletStatus)
                    ]
                )
            }

        }
    }
}