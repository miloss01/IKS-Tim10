import { DriverDTO, VehicleDTO } from "../models/models"

const driver: DriverDTO = {
    id: null,
    name: "TestName",
    surname: "TestSurname",
    telephoneNumber: "0604321",
    email: "test@email.com",
    address: "TestAddress",
    profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
    password: "333"
}

const driverResponse: DriverDTO = {
    id: 100,
    name: "TestName",
    surname: "TestSurname",
    telephoneNumber: "0604321",
    email: "test@email.com",
    address: "TestAddress",
    profilePicture: 'https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512',
    password: "333"
}

let vehicle: VehicleDTO = {
    id: null,
    driverId: null,
    vehicleType: "STANDARD",
    model: "citroen5e",
    licenseNumber: "ns12-pv",
    currentLocation: {
      address: 'Strazilovska 20, novi sad',
      latitude: 45.2501342,
      longitude: 19.8480507
    },
    passengerSeats: 5,
    babyTransport: true,
    petTransport: true
  }

export {driver, driverResponse, vehicle}