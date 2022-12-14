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