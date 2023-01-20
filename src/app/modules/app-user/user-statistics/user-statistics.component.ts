import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import { AppUser, Ride, RideResponseDTO } from 'src/app/models/models';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import { RideServiceService } from '../../ride/service/ride-service.service';
import { UserServiceService } from '../account/services/user.service';

@Component({
  selector: 'app-user-statistics',
  templateUrl: './user-statistics.component.html',
  styleUrls: ['./user-statistics.component.css']
})
export class UserStatisticsComponent implements OnInit {

  isAdmin: boolean = false
  userEmail: string = ""

  conditionFormGroup = new FormGroup({
    condition: new FormControl()
  })

  filterStartDate: string = '2022-11-22T03:23:23'
  filterEndDate: string = '2022-11-22T03:23:23'
  rides: Ride[] = []
  chart: any = null

  constructor(private rideService: RideServiceService, private authService: LoginAuthentificationService, private userService: UserServiceService) { }

  ngOnInit(): void {
    if (this.authService.getRole() == "ADMIN")
      this.isAdmin = true
  }

  convertDateUsrani(date: string): string {
    let datePart: string = date.split("T")[0]
    let timePart: string = date.split("T")[1]
    
    let year: string = datePart.split("-")[0]
    let month: string = datePart.split("-")[1]
    let day: string = datePart.split("-")[2]

    let hour: string = timePart.split(":")[0]
    let minute: string = timePart.split(":")[1]
    let second: string = timePart.split(":")[2]

    let ret: string = `${day}.${month}.${year} ${hour}:${minute}:${second}`

    return ret
  }

  async fetchRides(): Promise<void> {
    let startDate: string = this.convertDateUsrani(this.filterStartDate)
    let endDate: string = this.convertDateUsrani(this.filterEndDate)
    console.log(startDate)
    console.log(endDate)

    let id: string = ""
    if (this.authService.getRole() != "ADMIN")
      id = this.authService.getId()
    else {
      let user: AppUser | undefined = await this.userService.getUserByEmail(this.userEmail).toPromise()
      id = String(user?.id!)
    }

    this.rideService.getAllUserRidesWithDates(Number(id), startDate, endDate).subscribe((rides: RideResponseDTO) => {
      this.rides = []
      for (let ride of rides.results)
        if (ride.status == "finished")
          this.rides.push(ride)
      console.log(this.rides)

      if (this.conditionFormGroup.value.condition == "number-of-rides")
        this.showNumberOfRides()
      else if (this.conditionFormGroup.value.condition == "price")
        this.showMoney()
      else if (this.conditionFormGroup.value.condition == "km") {
        this.showKm()
      }
    })
  }

  showNumberOfRides(): void {
    let dates: string[] = []

    for (let ride of this.rides) {
      let date: string = ride.startTime.split(" ")[0]
      if (!dates.includes(date))
        dates.push(date)
    }

    let numOfRides: number[] = []
    let sum: number = 0

    for (let date of dates) {
      let num: number = 0
      for (let ride of this.rides) {
        let rideDate: string = ride.startTime.split(" ")[0]
        if (date == rideDate)
          num += 1
      }
      sum += num
      numOfRides.push(num)
    }

    this.chart = new Chart("myChart", {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          borderColor: "rgba(0,0,0,0.1)",
          data: numOfRides
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: `SUM: ${sum}, AVG: ${(sum / dates.length).toFixed(2)}`
        }
      }
    });
  }

  showMoney(): void {
    let dates: string[] = []

    for (let ride of this.rides) {
      let date: string = ride.startTime.split(" ")[0]
      if (!dates.includes(date))
        dates.push(date)
    }

    let money: number[] = []
    let sum: number = 0

    for (let date of dates) {
      let num: number = 0
      for (let ride of this.rides) {
        let rideDate: string = ride.startTime.split(" ")[0]
        if (date == rideDate)
          num += ride.totalCost
      }
      sum += num
      money.push(num)
    }

    this.chart = new Chart("myChart", {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          borderColor: "rgba(0,0,0,0.1)",
          data: money
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: `SUM: ${sum}, AVG: ${(sum / dates.length).toFixed(2)}`
        }
      }
    });
  }

  showKm(): void {
    let dates: string[] = []

    for (let ride of this.rides) {
      let date: string = ride.startTime.split(" ")[0]
      if (!dates.includes(date))
        dates.push(date)
    }

    let km: number[] = []
    let sum: number = 0

    for (let date of dates) {
      let num: number = 0
      for (let ride of this.rides) {
        let rideDate: string = ride.startTime.split(" ")[0]
        if (date == rideDate)
          if (ride.distance != undefined)
            num += ride.distance
      }
      sum += num
      km.push(num)
    }

    this.chart = new Chart("myChart", {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          borderColor: "rgba(0,0,0,0.1)",
          data: km
        }]
      },
      options: {
        legend: {display: false},
        title: {
          display: true,
          text: `SUM: ${sum}, AVG: ${(sum / dates.length).toFixed(2)}`
        }
      }
    });
  }

}
