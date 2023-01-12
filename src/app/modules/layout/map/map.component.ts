import { AfterViewInit, Component, Input } from '@angular/core'
import * as L from 'leaflet'
import 'leaflet-routing-machine'
import { VehicleResponceDTO } from 'src/app/models/models'
import { RideServiceService } from '../../ride/service/ride-service.service'
import { MapService } from '../services/map.service'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  @Input() item: boolean = false
  private map: any
  private routeControl: any
  private vehicles: VehicleResponceDTO = {
    size: 0,
    vehicles: []
  }

  constructor (private readonly mapService: MapService,
    private readonly rideService: RideServiceService) { }

  private initMap (): void {
    this.map = L.map('map', {
      center: [45.267136, 19.833549],
      zoom: 13
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    tiles.addTo(this.map)

    this.routeControl = L.Routing.control({})

    L.Marker.prototype.options.icon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png'
    })
    if (this.item) this.loadMarkers()
  }

  loadMarkers (): void {
    this.rideService
      .getVehiclesForMap()
      .subscribe((res: any) => {
        console.log(res)
        this.vehicles = res
        this.vehicles.vehicles.forEach(element => {
          if (element.active) {
            L.marker([element.currentLocation.latitude, element.currentLocation.longitude], {
              icon: L.icon({
                iconUrl: 'https://iconsplace.com/wp-content/uploads/_icons/007349/256/png/car-icon-17-256.png',
                iconSize: [40, 40]
              })
            }).addTo(this.map).bindPopup('Available!')
          } else {
            L.marker([element.currentLocation.latitude, element.currentLocation.longitude], {
              icon: L.icon({
                iconUrl: 'https://iconsplace.com/wp-content/uploads/_icons/ff0000/256/png/car-icon-14-256.png',
                iconSize: [40, 40]
              })
            }).addTo(this.map).bindPopup('Ocupied!')
          }
        })
      })
  }

  drawRoute (depLat: number, depLon: number, desLat: number, desLon: number): any {
    this.routeControl.setWaypoints(
      [
        L.latLng(depLat, depLon),
        L.latLng(desLat, desLon)
      ]
    )

    this.routeControl.addTo(this.map)

    // kod da se skloni prozor gde se prikazuju informacije o ruti
    const routingControlContainer = this.routeControl.getContainer()
    const controlContainerParent = routingControlContainer.parentNode
    controlContainerParent.removeChild(routingControlContainer)

    return this.routeControl
  }

  public getMap (): any { return this.map }

  ngAfterViewInit (): void {
    // kako da sredim ovo? probao sam OnViewChecked hook
    setTimeout(() => {
      if (this.map == undefined) {
        this.initMap()
        // this.registerOnClick();
      }
    }, 1000)
  }
}
