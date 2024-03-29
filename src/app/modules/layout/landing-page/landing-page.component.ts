import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { MapComponent } from '../map/map.component'
import { map, mergeMap } from 'rxjs'
import { MapService } from '../services/map.service'
import * as L from 'leaflet'
import { EstimateDataDTO } from 'src/app/models/models'
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service'

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements AfterViewInit {
  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  estimateDataFormGroup = new FormGroup({
    departure: new FormControl(),
    destination: new FormControl()
  });

  estimated_time: number | undefined = 0;
  estimated_price: number = 0;
  distance: number = 0;

  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  private departureMarker!: L.Marker
  private destinationMarker!: L.Marker
  private numOfMarkers: number = 0
  public role: String = ''
  public isActive: boolean = true
  public isActiveLabel: string = 'Active'

  constructor (private readonly http: HttpClient, private readonly mapService: MapService, private readonly authService: LoginAuthentificationService) { }

  ngOnInit (): void {
    this.role = this.authService.getRole()
  }

  ngAfterViewInit (): void {
    // this.role = this.authService.getRole()
    setTimeout(() => {
      this.registerOnClick()
      this.authService.getActiveFlag().subscribe((res: any) => {
        console.log(res)
        this.role = this.authService.getRole()
        this.isActive = res.active
        if (!this.isActive) this.isActiveLabel = 'Non active'
      })
    }, 1000)
  }

  estimate() {

    this.mapService.postRequest(
      this.estimateDataFormGroup.value.departure, 
      this.estimateDataFormGroup.value.destination)
    .pipe(
      // map((res: any) => {
      //   console.log(res)
      //   this.estimated_price = res.estimatedCost;
      // }),


      mergeMap(() => this.mapService.departureState),
      map((res: any) => {
        this.forRouteControl.depLat = res.latitude;
        this.forRouteControl.depLon = res.longitude;
      }),


      mergeMap(() => this.mapService.destinationState),
      map((res: any) => {
        this.forRouteControl.desLat = res.latitude;
        this.forRouteControl.desLon = res.longitude;
      })
    )
    .subscribe((res: any) => {
      
      if (this.departureMarker)
        this.departureMarker.remove();
      if (this.destinationMarker)
        this.destinationMarker.remove();
      this.numOfMarkers = 0;

      let routeControl = this.map?.drawRoute(
        // ovi podaci se moraju dobiti iz servisa
        this.forRouteControl.depLat,
        this.forRouteControl.depLon,
        this.forRouteControl.desLat,
        this.forRouteControl.desLon
      );

      routeControl.on('routesfound', (e: any) => {
        console.log(e);
        this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
        this.distance = Math.trunc(e.routes[0].summary.totalDistance / 1000);
        console.log(this.distance);
        

        let req: EstimateDataDTO = {
          locations: [
            {
              departure: {
                address: this.estimateDataFormGroup.value.departure,
                latitude: this.forRouteControl.depLat,
                longitude: this.forRouteControl.depLon
              },
              destination: {
                address: this.estimateDataFormGroup.value.destination,
                latitude: this.forRouteControl.desLat,
                longitude: this.forRouteControl.desLon
              }
            }
          ],
          vehicleType: undefined,
          petTransport: undefined,
          babyTransport: undefined,
          distance: this.distance
        }

        this.mapService.estimateData(req).subscribe((res: any) => {
          console.log(res);
          this.estimated_price = res.estimatedCost;
        })

      })
    })
    
  }

  registerOnClick(): void {
    this.map?.getMap().on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      this.mapService.getAddressFromLatLong(lat, lng).subscribe((res) => {

        let rc = this.map?.getMap().routeControl;
        console.log(rc);
        if (rc) {
          rc.removeFrom(this.map?.getMap());
        }
        
        let street = res.address.road;
        let houseNumber = res.address.house_number ? " " + res.address.house_number : "";
        let city = res.address.city_district;

        let full = `${street}${houseNumber}, ${city}`;
        console.log(full);
        
        if (this.numOfMarkers == 0) {
          this.departureMarker = new L.Marker([lat, lng]).addTo(this.map?.getMap());
          this.estimateDataFormGroup.patchValue({ departure: full });
        } else if (this.numOfMarkers == 1) {
          this.destinationMarker = new L.Marker([lat, lng]).addTo(this.map?.getMap());
          this.estimateDataFormGroup.patchValue({ destination: full })
        } else {
          this.departureMarker.removeFrom(this.map?.getMap())
          this.destinationMarker.removeFrom(this.map?.getMap())
          this.numOfMarkers = -1
        }

        this.numOfMarkers += 1
      })
    })
  }

  // String jsonn = "{\n  \"coordinates\": {\n    \"lat\": 23,\n    \"long\": 53\n  }\n}";
  // JsonNode rootNode = new ObjectMapper().readTree(new StringReader(jsonn));
  // String lat = rootNode.get("coordinates").get("lat").toString();
  // System.out.println(lat);
  onCheckChange (): void {
    if (this.isActive) {
      this.authService.endWorkingHour().subscribe((res: any) => {
        console.log(res)
        this.authService.changeActiveFlag(false).subscribe((res: any) => {
          console.log(res)
          this.isActiveLabel = 'Not Active'
          this.isActive = false
        })
      })
    } else {
      this.authService.addWorkingHour()
        .subscribe((res: any) => {
          this.authService.changeActiveFlag(true)
            .subscribe((res: any) => {
              console.log(res)
              this.isActiveLabel = 'Active'
              this.isActive = true
            })
        })
    }
  }
}
