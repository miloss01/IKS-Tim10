import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from '../map/map.component';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {

  @ViewChild(MapComponent, {static : true}) map : MapComponent | undefined;

  estimateDataFormGroup = new FormGroup({
    departure: new FormControl(),
    destination: new FormControl()
  });

  estimated_time: number | undefined = 0;
  estimated_price: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  estimate() {

    let departure: Location = {
      address: this.estimateDataFormGroup.value.departure,
      latitude: 0,
      longitude: 0
    };

    let destination: Location = {
      address: this.estimateDataFormGroup.value.destination,
      latitude: 0,
      longitude: 0
    }

    let departureDestination: DepartureDestination = {
      departure: departure,
      destination: destination
    };

    let req: EstimateDataDTO = {
      locations: [departureDestination]
    };

    this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + this.estimateDataFormGroup.value.departure)
    .subscribe((res: any) => {
      console.log(res);
      req.locations[0].departure.latitude = res[0].lat;
      req.locations[0].departure.longitude = res[0].lon;

      this.http.get("https://nominatim.openstreetmap.org/search?format=json&q=" + this.estimateDataFormGroup.value.destination)
      .subscribe((res: any) => {
        console.log(res);
        req.locations[0].destination.latitude = res[0].lat;
        req.locations[0].destination.longitude = res[0].lon;

        this.http.post<string>("http://localhost:8080/api/unregisteredUser", req)
        .subscribe((res: any) => {
          // this.estimated_time = res.estimatedTimeInMinutes;
          this.estimated_price = res.estimatedCost;

          let routeControl = this.map?.drawRoute(
            req.locations[0].departure.latitude,
            req.locations[0].departure.longitude,
            req.locations[0].destination.latitude,
            req.locations[0].destination.longitude
          );

          routeControl.on('routesfound', (e: any) => {
            this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
          })

        });

      })

    })
  }

  // String jsonn = "{\n  \"coordinates\": {\n    \"lat\": 23,\n    \"long\": 53\n  }\n}";
	// 	JsonNode rootNode = new ObjectMapper().readTree(new StringReader(jsonn));
	// 	String lat = rootNode.get("coordinates").get("lat").toString();
	// 	System.out.println(lat);

}
