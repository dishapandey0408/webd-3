
import express from 'express';

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Sample vehicle records
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Maruti Swift",
        vehicleNumber: "DL8CAF5030",
        type: "Hatchback",
        price: 750000
    },
    {
        id: 3,
        vehicleName: "Tata Nexon",
        vehicleNumber: "UP16AB1234",
        type: "SUV",
        price: 1200000
    }
];

// Function to validate vehicle data
function isValidVehicle(vehicle) {
    return vehicle &&
        vehicle.id !== undefined &&
        vehicle.id !== null &&
        vehicle.id !== '' &&
        typeof vehicle.vehicleName === 'string' &&
        vehicle.vehicleName.trim() !== '' &&
        typeof vehicle.vehicleNumber === 'string' &&
        vehicle.vehicleNumber.trim() !== '' &&
        typeof vehicle.type === 'string' &&
        vehicle.type.trim() !== '' &&
        typeof vehicle.price === 'number' &&
        vehicle.price > 0;
}

// 1. GET - Get all vehicles
app.get('/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// 2. GET - Get vehicle by ID
app.get('/vehicles/:id', (req, res) => {
    const id = Number(req.params.id);

    const vehicle = vehicles.find(v => v.id === id);

    if (!vehicle) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    res.status(200).json(vehicle);
});

// 3. POST - Add new vehicle
app.post('/vehicles', (req, res) => {
    const newVehicle = req.body;

    if (!isValidVehicle(newVehicle)) {
        return res.status(400).json({
            message: 'Invalid vehicle data'
        });
    }

    const existingVehicle = vehicles.find(
        v => v.id === newVehicle.id
    );

    if (existingVehicle) {
        return res.status(400).json({
            message: 'Vehicle ID already exists'
        });
    }

    vehicles.push(newVehicle);

    res.status(201).json({
        message: 'Vehicle added successfully',
        vehicle: newVehicle
    });
});

// 4. PUT - Update vehicle
app.put('/vehicles/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...req.body,
        id: vehicles[index].id
    };

    if (!isValidVehicle(updatedVehicle)) {
        return res.status(400).json({
            message: 'Invalid vehicle data'
        });
    }

    vehicles[index] = updatedVehicle;

    res.status(200).json({
        message: 'Vehicle updated successfully',
        vehicle: updatedVehicle
    });
});

// 5. DELETE - Delete vehicle
app.delete('/vehicles/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = vehicles.findIndex(v => v.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const deletedVehicle = vehicles.splice(index, 1);

    res.status(200).json({
        message: 'Vehicle deleted successfully',
        vehicle: deletedVehicle[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start Express server
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
