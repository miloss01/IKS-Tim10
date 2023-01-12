export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface DepartureDestination {
  departure: Location;
  destination: Location;
}

export interface EstimateDataDTO {
  locations: DepartureDestination[];
  vehicleType?: string;
  babyTransport?: boolean;
  petTransport?: boolean;
  distance: number;
}

export interface VehicleType {
  value: string;
  viewValue: string;
}

export interface Ride {
  id: number;
  locations: DepartureDestination[];
  startTime: string;
  endTime: string;
  totalCost: number;
  driver: AppUserForRide;
  passengers: AppUserForRide[];
  estimatedTimeInMinutes?: number;
  vehicleType?: string;
  babyTransport?: boolean;
  petTransport?: boolean;
}
export interface RideCreation {
  locations: DepartureDestination[];
  startTime: string;
  passengers: AppUserForRide[];
  vehicleType: string;
  babyTransport: boolean;
  petTransport: boolean;
  estimatedTimeMinutes: number;
}


export interface AppUserForRide {
  id: number;
  email: string
}

export interface AppUser {
  id: number;
  name: string,
  surname: string,
  telephoneNumber: string,
  email: string,
  address: string,
  profilePicture: string
}

export interface ReasonDTO {
  reason: string;
}


export interface DocumentDTO{
  id: number,
  name: string,
  documentImage: string,
  driverId: number
}

export interface Vehicle {
  id: number,
  driverId: number,
  vehicleType: string,
  model: string,
  licenseNumber: string,
  currentLocation: LocationDTO,
  passengerSeats: number;
  babyTransport: boolean,
  petTransport: boolean
}

export interface LocationDTO {
  address: string,
  latitude: number;
  longitude: number
}

export interface ChangeRequest {
  userDTO: AppUser;
  vehicleDTO: Vehicle;
  date: String;
}

export interface ChangeRequestResponce{
  numberOfRequests: number;
  requestDTOS: ChangeRequest[];
}

export interface RideReview {
  vehicleReview : Review;
  driverReview : Review;
}

export interface Review {
  id : number;

  rating : number;

  comment : string;
   
  passenger : AppUserForRide;
}


export interface DriverDTO {
  id: number | null;
  name: string,
  surname: string,
  telephoneNumber: string,
  email: string,
  address: string,
  profilePicture: string,
  password: string
}

export interface VehicleDTO {
  id: number | null,
  driverId: number | null,
  vehicleType: string,
  model: string,
  licenseNumber: string,
  currentLocation: Location,
  passengerSeats: number,
  babyTransport: boolean,
  petTransport: boolean
}

export interface PasswordResetCodeDTO {
  email: string | null,
  newPassword: string | null,
  code: string | null
}

export interface RideNotificationDTO {
  message: string
  rideId: number
}
