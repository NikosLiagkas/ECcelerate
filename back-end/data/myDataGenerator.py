import csv
import random
import string


def generate_drivers():
    first_names = [
        "Nikos", "Apostolos", "Alexandros", "Giannis",
        "Markos", "Alexandra", "Katerina", "Orestis",
        "Dimitris", "Giorgos", "Konstantinos", "Panagiotis", 
        "Christos", "Andreas", "Stefanos", "Manolis",
        "Spyros", "Vasilis", "Thodoris", "Vaggelis", 
        "Petros", "Achilleas", "Iasonas", "Agamemnonas"
            
    ]

    last_names = [
        "Liagkas", "Tzellas", "Mixos", "Komnas",
        "Bourdakos", "Kappa", "Liagka", "Mper",
        "Papadopoulos", "Nikolaidis", "Georgiou", "Dimitriou", 
        "Konstantinou", "Christodoulou", "Ioannidis", "Papanikolaou",
        "Anastasiou", "Karagiannis", "Vlahos", "Stavropoulos", 
        "Mantalos", "Raptis", "Makris", "Zografos"
    ]

    drivers=[]

    for i in range(24):
        first = first_names[i]
        last = last_names[i]
        random_num = random.randint(1000, 9999)
        password = f"password{random_num}"
        username = f"{first.lower()}_{last.lower()}{random_num}"
        email = f"{username}@mail.com"
        credit_points = random.randint(0, 500)
        balance = round(random.uniform(0, 200), 2)
        
        drivers.append([
            username,
            password,
            email,
            first,
            last,
            credit_points,
            balance
        ])
        
    with open("drivers.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "username",
            "password",
            "email",
            "first_name",
            "last_name",
            "credit_points",
            "balance"
        ])
        writer.writerows(drivers)

    print("drivers.csv generated with 25 drivers")
    

def generate_stations():

    providers = ["dei", "bombastic_electric", "big_energy"]

    streets = [
        "Panepistimiou",
        "Stadiou",
        "Patission",
        "Kifisias",
        "Syngrou",
        "Vouliagmenis",
        "Tsimiski",
        "Egnatia",
        "Venizelou",
        "Leoforos Athinon",
        "Leoforos Panagi Tsaldari",
        "Anapafseos",
        "Ioanni Foka"
    ]

    areas = [
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

    stations = []

    for i in range(15):
        # each station will have max 10 chargers
        num_chargers = random.randint(2, 10)
        
        # Athens approximate coordinates 
        lon = round(random.uniform(23.60, 23.80), 6)
        lat = round(random.uniform(37.90, 38.10), 6)
        
        # Respecting db enum for providers 
        provider = random.choice(providers)
        price_per_kwh = round(random.uniform(0.20, 0.60), 2)
        
        
        for i in range(15):
            if i < len(streets): 
                address_street = streets[i]
            else: address_street = random.choice(streets)        
        
        address_number = random.randint(1, 199)
        
        # 10xxx-19xxx is the range of postal codes in the Attiki aree
        postal_code = random.randint(11111, 19999)
        
        for i in range(15):
            if i < len(areas): 
                area = areas[i]
            else: area = random.choice(areas)
        
        stations.append([
                num_chargers,
                lon,
                lat,
                provider,
                price_per_kwh,
                address_street,
                address_number,
                postal_code,
                area
            ])
        

    with open("stations.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "num_chargers",
            "lon",
            "lat",
            "provider",
            "price_per_kwh",
            "address_street",
            "address_number",
            "postal_code",
            "area"
        ])
        writer.writerows(stations)
        

def generate_chargers():
    chargers = []
    
    charger_status = [
        "available",
        "charging",
        "reserved",
        "malfunction",
        "offline"
    ]

    charger_caps = [75, 100, 150]

    with open("stations_for_chargers.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            station_id = int(row["station_id"])
            num_chargers = int(row["num_chargers"])
            
            # I want my charger caps to be consecutive. This below ensures that,
            # e.g. 6 chargers --> caps : 75, 75, 100, 100, 150, 150
            #      7 chargers --> caps : 75, 75, 75, 100, 100, 150, 150
            result = []
            base = num_chargers // len(charger_caps)
            remainder = num_chargers % len(charger_caps)

            for i, cap in enumerate(charger_caps):
                count = base + (1 if i < remainder else 0)
                result.extend([cap] * count)
                            
            for charger_number, cap in enumerate(result, start=1):
                status = random.choices(
                    charger_status,
                    weights=[50, 20, 10, 10, 10],  # realistic distribution
                    k=1
                )[0]
                
                chargers.append([
                        status,
                        cap,
                        charger_number,
                        station_id
                    ])
            
    with open("chargers.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "status",
            "cap",
            "charger_number",
            "station_id"
        ])
        writer.writerows(chargers)

    print(f"chargers.csv generated with {len(chargers)} chargers")
                


def generate_vehicles():
    # I have generated 24 drivers exactly
    num_drivers = 24

    vehicle_types = ["motorcycle", "car", "truck"]
    vehicle_models = {
        "motorcycle": ("Honda", "Kawasaki"),
        "car": ("Tesla", "Nissan", "Ford", "Hyundai"),
        "truck": ("BMW", "Mercedes")
    }

    # Initially i will create 24 VEHICLES, one for each driver
    # Later a driver will have the ability to have more than one vehicle

    vehicles = []
    license_plates = []
            
    for j in range(1, num_drivers+1):
        # Generation of 24 license plates
        while True:
            plate = (
                random.choice(string.ascii_uppercase)+
                random.choice(string.ascii_uppercase)+
                random.choice(string.ascii_uppercase)+
                "-"+
                str(random.randint(1000, 9999))
            )
            if plate not in license_plates:
                license_plates.append(plate)
                break; 
        
            
        type = random.choice(vehicle_types)
        model = random.choice(vehicle_models[type])
        
        if type == "motorcycle": battery_size = 15
        elif type == "car"     : battery_size = 40
        elif type == "truck"   : battery_size = 120 
        driver_id = j
        
        vehicles.append([
            plate,
            type,
            model,
            battery_size,
            driver_id
        ])
        
    with open("vehicles.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "license_plates",
            "vehicle_type",
            "model",
            "battery_size",
            "driver_id"
        ])
        writer.writerows(vehicles)

    print(f"vehicles.csv generated with {len(vehicles)} vehicles")




################################################    
#generate_drivers()
#generate_stations()

################################################################################################
# After generating stations to generate the chargers, we need have to the station_id for each charger
# To do that you must run this command in your bash terminal 
# " psql -U postgres -d SoftengDB " (SoftengDB is my DB name, fill whatever the name of your DB is)
# put your password
# then run this command : 
# " \copy (SELECT station_id, num_chargers FROM station) TO 'stations_for_chargers.csv' CSV HEADER " 
# and you will have how many chargers each station has in stations_for_chargers.csv
################################################################################################
#generate_chargers()

generate_vehicles()


