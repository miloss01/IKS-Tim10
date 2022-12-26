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
  estimatedTimeInMinutes: number;
  vehicleType?: string;
  babyTransport?: boolean;
  petTransport?: boolean;
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
