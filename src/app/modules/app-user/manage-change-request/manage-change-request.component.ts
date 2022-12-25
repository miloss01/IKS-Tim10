import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeRequestService } from '../services/change-request.service';

@Component({
  selector: 'app-manage-change-request',
  templateUrl: './manage-change-request.component.html',
  styleUrls: ['./manage-change-request.component.css']
})
export class ManageChangeRequestComponent implements OnInit {

  constructor(
    private route:ActivatedRoute,
    private changeRequestService: ChangeRequestService,
    private router: Router) { }

  ngOnInit(): void {
  }

  viewRequest(driverId:number) : void{
    this.router.navigate(['/change-request']);
  }
}
