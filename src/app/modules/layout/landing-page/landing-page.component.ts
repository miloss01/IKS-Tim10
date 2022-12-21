import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MapComponent } from '../map/map.component';
import { Location, DepartureDestination, EstimateDataDTO } from 'src/app/models/models';
import { environment } from 'src/environments/environment';
import { map, mergeMap } from 'rxjs';
import { MapService } from '../services/map.service';

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

  forRouteControl = {
    depLat: 0,
    depLon: 0,
    desLat: 0,
    desLon: 0
  };

  constructor(private http: HttpClient, private mapService: MapService) { }

  ngOnInit(): void {
  }

  estimate() {

    this.mapService.postRequest(
      this.estimateDataFormGroup.value.departure, 
      this.estimateDataFormGroup.value.destination,
      undefined,
      undefined,
      undefined)
    .pipe(
      map((res: any) => {
        console.log(res)
        this.estimated_price = res.estimatedCost;
      }),

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
      let routeControl = this.map?.drawRoute(
        // ovi podaci se moraju dobiti iz servisa
        this.forRouteControl.depLat,
        this.forRouteControl.depLon,
        this.forRouteControl.desLat,
        this.forRouteControl.desLon
      );

      routeControl.on('routesfound', (e: any) => {
        this.estimated_time = Math.trunc(e.routes[0].summary.totalTime / 60);
      })
    })
    
  }

  // String jsonn = "{\n  \"coordinates\": {\n    \"lat\": 23,\n    \"long\": 53\n  }\n}";
	// 	JsonNode rootNode = new ObjectMapper().readTree(new StringReader(jsonn));
	// 	String lat = rootNode.get("coordinates").get("lat").toString();
	// 	System.out.println(lat);

}
