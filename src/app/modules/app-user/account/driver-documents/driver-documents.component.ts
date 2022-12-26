import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../services/user.service';

@Component({
  selector: 'app-driver-documents',
  templateUrl: './driver-documents.component.html',
  styleUrls: ['./driver-documents.component.css']
})


export class DriverDocumentsComponent implements OnInit {
  documents: DocumentDTO[] = [];

  constructor(
    private route:ActivatedRoute,
    private userService: UserServiceService
  ) { }

  ngOnInit(): void {
    this.userService.selectedValue$.subscribe((value) => {
      this.route.params.subscribe((params) => {
        this.userService
        .getDriverDocuments()
        .subscribe((fetchedDocuments:DocumentDTO[]) => {
          this.documents =fetchedDocuments;
          console.log("DRIVER DOCUMENTS COMPONENT - Fetched Documents for User with id " + value +", " + JSON.stringify(this.documents));
          })
      });
    })
  }

}

export interface DocumentDTO{
  id: number,
  name: string,
  documentImage: string,
  driverId: number
}
