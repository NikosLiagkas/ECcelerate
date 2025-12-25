BEGIN;

--
-- Name: point_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE charger_status AS ENUM (
    'available',
    'charging',
    'reserved',
    'malfunction',
    'offline'
);

CREATE TYPE vehicle_types AS ENUM (
    'motorcycle',
    'car',
    'truck'
);

CREATE TYPE providers AS ENUM (
    'DEI',
    'bombastic_electric',
    'big_energy'
);


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: -
--

-- maybe use id INTEGER GENERATED ALWAYS AS IDENTITY, check later

CREATE TABLE driver (
    driver_id       SERIAL PRIMARY KEY,
    username        VARCHAR(255) NOT NULL, 
    password        VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    first_name      VARCHAR(255),
    last_name       VARCHAR(255),
    credit_points   INTEGER,
    balance         DECIMAL(15,2) DEFAULT 0.00
);

CREATE TABLE vehicle (
    license_plates  VARCHAR(15) PRIMARY KEY,
    vehicle_type    vehicle_types NOT NULL, 
    model           VARCHAR(255) NOT NULL,
    battery_size    INTEGER
);


CREATE TABLE charger (
    charger_id      SERIAL PRIMARY KEY,
    status          charger_status NOT NULL,
    cap             INTEGER NOT NULL,
    charger_number  INTEGER NOT NULL
);


CREATE TABLE station (
    station_id      SERIAL PRIMARY KEY,
    num_chargers    INTEGER NOT NULL,    
    lon             numeric(9,6) NOT NULL,
    lat             numeric(9,6) NOT NULL,
    provider        providers NOT NULL,
    price_per_kwh   numeric(9,2) NOT NULL,
    address_street  varchar(50) NOT NULL,
    address_number  INTEGER NOT NULL,
    postal_code     INTEGER NOT NULL,    
    area            varchar(50) NOT NULL
);

CREATE TABLE payment (
    payment_id      SERIAL PRIMARY KEY,
    price_paid      DECIMAL(9,2) NOT NULL, 
    paid_at         TIMESTAMP NOT NULL,
    points_used     INTEGER
);

CREATE TABLE charging (
    charge_id           SERIAL PRIMARY KEY,
    connection_time     TIMESTAMP NOT NULL,
    disconnection_time  TIMESTAMP NOT NULL,
    start_soc           INTEGER,
    end_soc             INTEGER,
    kwh_needed          DECIMAL(9,2),
    kwh_price           DECIMAL(9,2),
    price               DECIMAL(9,2) 
);



COMMIT;
