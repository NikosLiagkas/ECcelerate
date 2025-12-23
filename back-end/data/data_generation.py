import os
import random
from decimal import Decimal
from faker import Faker
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv

DATABASE_URL = "postgresql://softeng:softeng@localhost:5432/softeng25"
fake = Faker()


"""
    This functions generate a given number of rows and populate them with random or specified data.
"""

def generate_stations(number_of_stations: int = 4):
    station_ids = []
    with psycopg.connect(DATABASE_URL) as con:
        cur = con.cursor()
        providers = ["Picachu", "Best Energy", "Bombastic Electric", "Zeus"]
        prices = [0.4300, 0.5200, 0.4700, 0.5600]
        for i in range(number_of_stations):
            cur.execute(
                "INSERT INTO stations (lon, lat, provider, address, price_per_kwh) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (
                    str(round(random.uniform(-180, 180), 6)),
                    str(round(random.uniform(-90, 90), 6)),
                    providers[i],
                    fake.street_address()[:50],
                    prices[i]
                 )
            )
            station_ids.append(cur.fetchone()[0])

    print(f"Made {number_of_stations} stations with ids : {station_ids}")

def generate_points(points_per_station: int = 3):
    point_ids = []
    with psycopg.connect(DATABASE_URL) as con:
        cur = con.cursor()
        cur.execute("SELECT unnest(enum_range(NULL::point_status))")
        statuses = [r[0] for r in cur.fetchall()]
        caps = [20, 22, 50]
        cur.execute("SELECT id FROM stations ORDER BY id")
        station_ids = [r[0] for r in cur.fetchall()]
        for j in station_ids:
            for i in range(points_per_station):
                cur.execute(
                    "INSERT INTO points (status, cap, station_id) VALUES (%s, %s, %s) RETURNING id",
                    (
                        random.choice(statuses),
                        random.choice(caps),
                        j
                    )
                )
                point_ids.append(cur.fetchone()[0])
        print(f"Created {points_per_station*len(station_ids)} points with ids : {point_ids}")

def generate_outlets(outlets_per_point: int = 2):
    outlet_ids = []
    with psycopg.connect(DATABASE_URL) as con:
        cur = con.cursor()
        cur.execute("SELECT unnest(enum_range(NULL::connector_type))")
        types = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT unnest(enum_range(NULL::outlet_status))")
        statuses = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT id FROM points ORDER BY id")
        point_ids = [r[0] for r in cur.fetchall()]
        for i in point_ids:
            for _ in range(outlets_per_point):
                cur.execute(
                    "INSERT INTO outlets (point_id, type, status) VALUES (%s, %s, %s) RETURNING id",
                    (
                        i,
                        random.choice(types),
                        random.choice(statuses)
                    )
                )
                outlet_ids.append(cur.fetchone()[0])
    print(F"Created {outlets_per_point*len(point_ids)} outlets with ids : {outlet_ids}")


generate_outlets()
# generate_points()
# generate_stations()
