import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as Chart from 'chart.js';
import { AppUser, Ride, RideResponseDTO } from 'src/app/models/models';
import { LoginAuthentificationService } from '../../auth/service/login-authentification.service';
import { RideServiceService } from '../../ride/service/ride-service.service';
import { UserServiceService } from '../account/services/user.service';
import { accountsDTO } from '../manage-passengers/manage-passengers.component';

interface Stats {
  numOfRides: number,
  km: number,
  money: number
}

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

  showPassengers: boolean = true
  showDrivers: boolean = true
  groupStats: Map<string, Stats> = new Map()

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
      else if (this.conditionFormGroup.value.condition == "km")
        this.showKm()
    })
  }

  async fetchGroupRides(): Promise<void> {
    let startDate: string = this.convertDateUsrani(this.filterStartDate)
    let endDate: string = this.convertDateUsrani(this.filterEndDate)
    let rideResponseDTO: RideResponseDTO | undefined = await this.rideService.getAllRides(startDate, endDate).toPromise()
    let dates: string[] = []
    this.groupStats = new Map()
    this.rides = rideResponseDTO?.results!
    console.log(rideResponseDTO)

    for (let ride of rideResponseDTO?.results!) {
      let date: string = ride.startTime.split(" ")[0]
      if (!dates.includes(date))
        dates.push(date)

      if (this.showPassengers) {
        for (let passenger of ride.passengers) {
          if (this.groupStats.get(passenger.email) == undefined) {
            let stat: Stats = {
              numOfRides: 1,
              km: ride.distance!,
              money: ride.totalCost
            }
            this.groupStats.set(passenger.email, stat)
          }
          else {
            let currentStat: Stats = this.groupStats.get(passenger.email)!
            currentStat.numOfRides += 1
            currentStat.km += ride.distance!
            currentStat.money += ride.totalCost
            this.groupStats.set(passenger.email, currentStat)
          }
        }
      }

      if (this.showDrivers) {
        if (this.groupStats.get(ride.driver.email) == undefined) {
          let stat: Stats = {
            numOfRides: 1,
            km: ride.distance!,
            money: ride.totalCost
          }
          this.groupStats.set(ride.driver.email, stat)
        }
        else {
          let currentStat: Stats = this.groupStats.get(ride.driver.email)!
          currentStat.numOfRides += 1
          currentStat.km += ride.distance!
          currentStat.money += ride.totalCost
          this.groupStats.set(ride.driver.email, currentStat)
        }
      }
    }

    console.log(dates)
    console.log(this.groupStats)

    if (this.conditionFormGroup.value.condition == "number-of-rides")
      this.showGroup("number-of-rides")
    else if (this.conditionFormGroup.value.condition == "price")
      this.showGroup("money")
    else if (this.conditionFormGroup.value.condition == "km")
      this.showGroup("km")

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

    this.showChart(dates, numOfRides, sum)
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

    this.showChart(dates, money, sum)
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

    this.showChart(dates, km, sum)
    
  }

  showChart(dates: string[], condition: number[], sum: number): void {
    if (this.chart)
      this.chart.destroy()
    this.chart = new Chart("myChart", {
      type: "line",
      data: {
        labels: dates,
        datasets: [{
          borderColor: "rgba(0,0,0,0.1)",
          data: condition
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

  showGroup(criteria: string): void {

    let dates: string[] = []

    for (let ride of this.rides) {
      let date: string = ride.startTime.split(" ")[0]
      if (!dates.includes(date))
        dates.push(date)
    }

    let chartData: any = {
      type: "line",
      data: {
        labels: dates,
        datasets: []
      }
    }

    let stat: Map<string, number[]> = new Map()

    for (let date in dates) {

      for (let ride of this.rides) {
        let rideDate: string = ride.startTime.split(" ")[0]
        
        if (dates[date] == rideDate) {

          if (this.showPassengers) {
            for (let passenger of ride.passengers) {
              if (stat.get(passenger.email) == undefined) {
                let arr: Array<number> = new Array(dates.length).fill(0)
                if (criteria == "number-of-rides")
                  arr[date] = 1
                else if (criteria == "km")
                  arr[date] = ride.distance!
                else if (criteria == "money")
                  arr[date] = ride.totalCost
                stat.set(passenger.email, arr)
              }
              else {
                let curr: Array<number> = stat.get(passenger.email)!
                if (criteria == "number-of-rides")
                  curr[date] += 1
                else if (criteria == "km")
                  curr[date] += ride.distance!
                else if (criteria == "money")
                  curr[date] += ride.totalCost
                stat.set(passenger.email, curr)
              }
            }
          }

          if (this.showDrivers) {
            if (stat.get(ride.driver.email) == undefined) {
              let arr: Array<number> = new Array(dates.length).fill(0)
              if (criteria == "number-of-rides")
                  arr[date] = 1
                else if (criteria == "km")
                  arr[date] = ride.distance!
                else if (criteria == "money")
                  arr[date] = ride.totalCost
              stat.set(ride.driver.email, arr)
            }
            else {
              let curr: Array<number> = stat.get(ride.driver.email)!
              if (criteria == "number-of-rides")
                  curr[date] += 1
                else if (criteria == "km")
                  curr[date] += ride.distance!
                else if (criteria == "money")
                  curr[date] += ride.totalCost
              stat.set(ride.driver.email, curr)
            }
          }

        }
      }
    }
    
    for (let email of stat.keys()) {
      let sum: number = stat.get(email)!.reduce(function(a, b) { return a + b; }, 0)
      let obj = {
        "label": `${email} (${sum}/${(sum / dates.length).toFixed(2)})`,
        "borderColor": `rgba(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},1)`,
        "fill": true,
        "data": stat.get(email)
      }
      console.log(obj)
      chartData["data"]["datasets"].push(obj)
    }

    if (this.chart)
      this.chart.destroy()
    this.chart = new Chart("myChart", chartData);
  }

}
