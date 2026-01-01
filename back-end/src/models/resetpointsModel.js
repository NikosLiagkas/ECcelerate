

const { pool } = require("../config/db");
const fs = require("fs");
const RESET_FILE = "./data/parts1234.json";

exports.initialisePoints = async () => {

    // Empty the tables to repopulate 
    await pool.query("TRUNCATE TABLE charger, station RESTART IDENTITY CASCADE");

    const raw = fs.readFileSync(RESET_FILE, "utf8");

    const stations = JSON.parse(raw);

    // Random values to initialise stations
    function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
    }

    const providers = ["dei", "bombastic_electric", "big_energy"]
    const caps = [75, 100, 150]
    const status = ["available", "charging", "reserved", "malfunction", "offline"];
    const areas = [
                    "Athens",
                    "Piraeus",
                    "Marousi",
                    "Kallithea",
                    "Nea Smyrni",
                    "Chalandri",
                    "Glyfada",
                    "Peristeri",
                    "Filadelfeia",
                    "Ilion",
                    "Mosxato",
                    "Ano Patisia"
                ]

    
    for(const station of stations){

        const stationDetails =await pool.query(
        `INSERT INTO station (station_id, num_chargers, lon, lat, provider, price_per_kwh, address_street, address_number, postal_code, area)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING station_id`,
        [
            station.id,
            station.stations.length,                 
            station.longitude,
            station.latitude,
            randomFrom(providers),
            Number((Math.random() * 0.4 + 0.2).toFixed(2)),
            station.address.slice(0, 50),
            0,
            Math.floor(Math.random() * (19999 - 11111 + 1)) + 11111,
            randomFrom(areas)
        ]
        );

        const stationId = stationDetails.rows[0].station_id;
        let count = 1;
        for (const charger of station.stations) {
            const chargerDetails = await pool.query(
                `INSERT INTO charger (charger_id, status, cap, charger_number, station_id)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING charger_id`,
                [
                    charger.id,                
                    randomFrom(status),
                    randomFrom(caps),
                    count,
                    stationId
                ]
            );
            count += 1;
        }
    }
}