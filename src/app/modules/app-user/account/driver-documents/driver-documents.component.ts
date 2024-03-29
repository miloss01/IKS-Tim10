import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { DocumentDTO } from 'src/app/models/models'
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service'
import { UserServiceService } from '../services/user.service'

@Component({
  selector: 'app-driver-documents',
  templateUrl: './driver-documents.component.html',
  styleUrls: ['./driver-documents.component.css']
})

export class DriverDocumentsComponent implements OnInit {
  documents: DocumentDTO[] = []
  role: string = ''

  constructor (
    private readonly route: ActivatedRoute,
    private readonly userService: UserServiceService,
    private readonly authentificationService: LoginAuthentificationService
  ) { }

  ngOnInit (): void {
    this.route.params.subscribe((params) => {
      this.userService
        .getDriverDocuments(this.authentificationService.getId())
        .subscribe((fetchedDocuments: DocumentDTO[]) => {
          this.documents = fetchedDocuments
          this.role = this.authentificationService.getRole()
          console.log('DRIVER DOCUMENTS COMPONENT - Fetched Documents for User with id' + JSON.stringify(this.documents))
        })
    })
  }
}
