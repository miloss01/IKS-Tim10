import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeRequest, ChangeRequestResponce } from 'src/app/models/models';
import { ChangeRequestInfoComponent } from '../change-request-info/change-request-info.component';
import { ChangeRequestService } from '../services/change-request.service';

@Component({
  selector: 'app-manage-change-request',
  templateUrl: './manage-change-request.component.html',
  styleUrls: ['./manage-change-request.component.css']
})
export class ManageChangeRequestComponent implements OnInit {
  changeRequestResponce:ChangeRequestResponce = {
    numberOfRequests: 0,
    requestDTOS: []
  }

  constructor(
    private route:ActivatedRoute,
    private changeRequestService: ChangeRequestService,
    private router: Router,
    public changeDetailsDialog: MatDialog) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.changeRequestService
      .getPendingChangeRequests()
      .subscribe((fetchedRequests:ChangeRequestResponce) => {
        this.changeRequestResponce =fetchedRequests; 
        })
    });
  }

  viewRequest(chaangeRequest:ChangeRequest) : void{
    const rideDetailsDialog = this.changeDetailsDialog.open(ChangeRequestInfoComponent, {
      width: '900px',
      height: '500px',
      data: { changeeRequest: chaangeRequest }
    });
  }

  acceptRequest(request:ChangeRequest): void {
    this.route.params.subscribe((params) => {
      this.changeRequestService
      .acceptChangesRequest(request, request.userDTO.id)
      .subscribe((res:any) => {
        console.log(res); 
        this.router.navigate(['/manage-change-requests']);
        })
    });
  }
}
