import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  private map: any;
  private routeControl: any;

  private initMap(): void {
    this.map = L.map('map', {
      center: [45.267136, 19.833549],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  drawRoute(depLat: number, depLon: number, desLat: number, desLon: number): any {
    this.routeControl = L.Routing.control({
      waypoints: [L.latLng(depLat, depLon), L.latLng(desLat, desLon)]
    }).addTo(this.map);

    // kod da se skloni prozor gde se prikazuju informacije o ruti
    // let routingControlContainer = this.routeControl.getContainer();
    // let controlContainerParent = routingControlContainer.parentNode;
    // controlContainerParent.removeChild(routingControlContainer);

    return this.routeControl;
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
