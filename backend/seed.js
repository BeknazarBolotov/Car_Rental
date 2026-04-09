const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User');
const Car = require('./src/models/Car');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({}); await Car.deleteMany({});

  const admin = await User.create({ name: 'Admin User', email: 'admin@demo.com', password: 'password123', role: 'admin' });
  await User.create({ name: 'Manager User', email: 'manager@demo.com', password: 'password123', role: 'manager' });
  await User.create({ name: 'John User', email: 'user@demo.com', password: 'password123', role: 'user' });

  const cars = [
    { brand:'BMW', model:'M5', year:2023, category:'luxury', pricePerDay:250, transmission:'automatic', fuel:'petrol', seats:5, color:'Black', isAvailable:true, location:'Bishkek', description:'Ultimate driving machine', features:['Heated Seats','Sunroof','360 Camera','Premium Sound'] },
    { brand:'Tesla', model:'Model S', year:2023, category:'electric', pricePerDay:200, transmission:'automatic', fuel:'electric', seats:5, color:'White', isAvailable:true, location:'Bishkek', description:'Full self-driving capable', features:['Autopilot','Supercharging','Panoramic Roof'] },
    { brand:'Porsche', model:'911 Carrera', year:2022, category:'sports', pricePerDay:350, transmission:'automatic', fuel:'petrol', seats:2, color:'Silver', isAvailable:true, location:'Bishkek', description:'Icon of sports car engineering', features:['Sport Chrono','Launch Control','Bose Sound'] },
    { brand:'Toyota', model:'Camry', year:2023, category:'sedan', pricePerDay:80, transmission:'automatic', fuel:'petrol', seats:5, color:'Gray', isAvailable:true, location:'Bishkek', description:'Reliable and comfortable', features:['Apple CarPlay','Lane Assist','Blind Spot Monitor'] },
    { brand:'Range Rover', model:'Sport', year:2023, category:'suv', pricePerDay:300, transmission:'automatic', fuel:'hybrid', seats:7, color:'Green', isAvailable:true, location:'Bishkek', description:'Luxury meets capability', features:['Air Suspension','Terrain Response','Head-up Display'] },
    { brand:'Mercedes', model:'Sprinter', year:2022, category:'minivan', pricePerDay:150, transmission:'automatic', fuel:'diesel', seats:12, color:'White', isAvailable:true, location:'Bishkek', description:'Perfect for group travel', features:['USB Charging','Rear AC','Luggage Space'] },
  ];
  await Car.insertMany(cars.map(c => ({ ...c, addedBy: admin._id })));

  console.log('✅ Seed complete! Demo accounts: admin@demo.com, manager@demo.com, user@demo.com (password: password123)');
  process.exit();
}
seed().catch(console.error);