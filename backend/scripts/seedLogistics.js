import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

import connectDB from "../config/db.js";

import Warehouse from "../models/warehouse.model.js";
import TransportProvider from "../models/transportProvider.model.js";

const warehouses = [
    {
        name: "Central Agricultural Warehouse",
        type: "godown",
        location: "Gorakhpur Industrial Area",
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        capacity: 5000,
        availableCapacity: 2300,
        ratePerQuintal: 15,
        rating: 4.3,
        status: "active",
    },
    {
        name: "National Cold Storage",
        type: "cold_storage",
        location: "NH-28 Bypass Road",
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        capacity: 2000,
        availableCapacity: 800,
        ratePerQuintal: 35,
        rating: 4.6,
        status: "active",
    },
    {
        name: "Kisaan Sewa FPO Warehouse",
        type: "godown",
        location: "Village Road, Gorakhpur",
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        capacity: 800,
        availableCapacity: 450,
        ratePerQuintal: 10,
        rating: 4.0,
        status: "active",
    },
    {
        name: "Agri Cold Chain",
        type: "cold_storage",
        location: "APMC Market Yard",
        district: "Gorakhpur",
        state: "Uttar Pradesh",
        capacity: 3000,
        availableCapacity: 1200,
        ratePerQuintal: 40,
        rating: 4.7,
        status: "active",
    },
];

const transportProviders = [
    {
        providerName: "Kisan Transport Services",
        vehicleType: "Mini Truck",
        vehicleCapacity: 10,
        pricePerKm: 18,
        driverName: "Sunil Kumar",
        driverPhone: "9800000001",
        rating: 4.2,
        available: true,
        status: "active",
    },
    {
        providerName: "Bharat Agro Logistics",
        vehicleType: "Truck",
        vehicleCapacity: 50,
        pricePerKm: 35,
        driverName: "Rajesh Singh",
        driverPhone: "9800000002",
        rating: 4.5,
        available: true,
        status: "active",
    },
    {
        providerName: "Bharat Heavy Transport",
        vehicleType: "Heavy Truck",
        vehicleCapacity: 100,
        pricePerKm: 55,
        driverName: "Manoj Yadav",
        driverPhone: "9800000003",
        rating: 4.1,
        available: false,
        status: "active",
    },
    {
        providerName: "Rural Farm Transport",
        vehicleType: "Tractor Trolley",
        vehicleCapacity: 25,
        pricePerKm: 12,
        driverName: "Dinesh Patel",
        driverPhone: "9800000004",
        rating: 3.9,
        available: true,
        status: "active",
    },
];

const seedLogistics = async () => {
    try {
        await connectDB();

        for (const warehouse of warehouses) {
            await Warehouse.findOneAndUpdate(
                {
                    name: warehouse.name,
                    district: warehouse.district,
                    state: warehouse.state,
                },
                warehouse,
                {
                    upsert: true,
                    returnDocument: "after",
                    setDefaultsOnInsert: true,
                }
            );
        }

        for (const provider of transportProviders) {
            await TransportProvider.findOneAndUpdate(
                {
                    providerName: provider.providerName,
                    vehicleType: provider.vehicleType,
                },
                provider,
                {
                    upsert: true,
                    returnDocument: "after",
                    setDefaultsOnInsert: true,
                }
            );
        }

        console.log(
            `Seeded ${warehouses.length} warehouses and ${transportProviders.length} transport providers.`
        );
    } catch (error) {
        console.error("Logistics seed failed:", error);
        process.exitCode = 1;
    } finally {
        process.exit();
    }
};

seedLogistics();