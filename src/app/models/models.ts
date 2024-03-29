export interface Location {
  address: string
  latitude: number
  longitude: number
}

export interface DepartureDestination {
  departure: Location
  destination: Location
}

export interface EstimateDataDTO {
  locations: DepartureDestination[]
  vehicleType?: string
  babyTransport?: boolean
  petTransport?: boolean
  distance: number
}

export interface VehicleType {
  value: string
  viewValue: string
}

export interface Ride {
  id: number
  locations: DepartureDestination[]
  startTime: string
  endTime: string
  totalCost: number
  driver: AppUserForRide
  passengers: AppUserForRide[]
  estimatedTimeInMinutes?: number
  vehicleType?: string
  babyTransport?: boolean
  petTransport?: boolean
  distance?: number
  status?: string
}
export interface RideCreation {
  locations: DepartureDestination[]
  startTime: string
  passengers: AppUserForRide[]
  vehicleType: string
  babyTransport: boolean
  petTransport: boolean
  estimatedTimeMinutes: number
  distance: number
  price: number
}

export interface AppUserForRide {
  id: number
  email: string
}

export interface AppUser {
  id: number
  name: string
  surname: string
  telephoneNumber: string
  email: string
  address: string
  profilePicture: string
}

export interface ReasonDTO {
  reason: string
}

export interface DocumentDTO {
  id: number
  name: string
  documentImage: string
  driverId: number
}

export interface Vehicle {
  id: number
  driverId: number
  vehicleType: string
  model: string
  licenseNumber: string
  currentLocation: LocationDTO
  passengerSeats: number
  babyTransport: boolean
  petTransport: boolean
}

export interface LocationDTO {
  address: string
  latitude: number
  longitude: number
}

export interface ChangeRequest {
  userDTO: AppUser
  vehicleDTO: Vehicle
  date: String
}

export interface ChangeRequestResponce {
  numberOfRequests: number
  requestDTOS: ChangeRequest[]
}

export interface RideReview {
  vehicleReview: Review
  driverReview: Review
}

export interface RideResponseDTO {
  totalCount: number
  results: Ride[]
}

export interface Review {
  id: number
  rating: number
  comment: string
  passenger: AppUserForRide
}

export interface ReviewRequest {
  comment : string
  rating : number
}

export interface DriverDTO {
  id: number | null
  name: string
  surname: string
  telephoneNumber: string
  email: string
  address: string
  profilePicture: string
  password: string
}

export interface VehicleDTO {
  id: number | null
  driverId: number | null
  vehicleType: string
  model: string
  licenseNumber: string
  currentLocation: Location
  passengerSeats: number
  babyTransport: boolean
  petTransport: boolean
}

export interface PasswordResetCodeDTO {
  email: string | null
  newPassword: string | null
  code: string | null
}

export interface FavoriteRouteDTO {
  id: number | null,
  favoriteName: string,
  locations: DepartureDestination[],
  passengers: AppUserForRide[],
  vehicleType: string,
  babyTransport: boolean,
  petTransport: boolean
}

export interface VehicleForMap {
  currentLocation: LocationDTO
  active: boolean
}

export interface VehicleResponceDTO {
  size: number
  vehicles: VehicleForMap[]
}

export interface RideNotificationDTO {
  message: string
  rideId: number
  reason: string
}

export interface MessageReceivedDTO {
  id: number
  timeOfSending: string
  senderId: number
  receiverId: number
  message: string
  type: string
  rideId: number
}

export interface MessageResponseDTO {
  totalCount: number
  results: MessageReceivedDTO[]
}

export interface MessageSentDTO {
  receiverId: number
  message: string
  type: string
  rideId: number
}

export interface ChangePasswordDTO {
  newPassword: string
  oldPassword: string
}
