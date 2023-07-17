# Transportation app frontend

Project for course Client Side Engineering.  
Angular-based frontend of web application for providing transportation services ([Backend link](https://github.com/miloss01/ISS-Tim10)).  
Focus of project is creating a user-friendly interface for seamlessly connecting passengers with drivers. Main functionalities include requesting rides and following real time information of ride currently in progress.

## Technologies

Project is created with:

* Angular: 14.2.10

### Libraries
- Angular Material: 13.0.0
- Leaflet: 1.9.3
- SweetAlert: 11.6.16
- Chart.js: 2.9.4

## Features

* User registration
* Ride booking  
	Passengers can specify pickup and drop off locations with additional ride preferences and invite additional passenger.
	Drivers can accept or decline ride requests.
* Real-Time vehicle location tracking  
	Includes tracking available vehicles on map, and following driver's location for ride currently in progress.
	Passengers can contact admins in case of emergency.
* Driver rating and reviews
* Driver verification by admin user  
	Includes reviewing account changes made by drivers.
* Ride history overview
* Driver earnings and reports

## Key learnings
* Map integration and location handling
* Web sockets for real-time communication

## Setup

1. Clone repository and run npm install to install dependencies.
2. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 


## Credits

* Milos Stojanovic ([github link](https://github.com/miloss01))
* Selena Milutin ([github link](https://github.com/SelenaMilutin))
* Katarina Spremic ([github link](https://github.com/s-katarina))
