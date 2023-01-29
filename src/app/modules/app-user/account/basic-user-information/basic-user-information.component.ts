/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LoginAuthentificationService } from 'src/app/modules/auth/service/login-authentification.service'
import { UserServiceService } from '../services/user.service'
import { MatDialog } from '@angular/material/dialog'
import { ResetPasswordDialogComponent } from 'src/app/modules/layout/dialogs/reset-password-dialog/reset-password-dialog.component'

@Component({
  selector: 'app-basic-user-information',
  templateUrl: './basic-user-information.component.html',
  styleUrls: ['./basic-user-information.component.css']
})
export class BasicUserInformationComponent implements OnInit {
  // imageSrc: string;
  @Output() userEvent = new EventEmitter<AppUser>()
  user: AppUser = {
    id: 0,
    name: '',
    surname: 'Feling',
    telephoneNumber: '0653531317',
    email: 'sandra@gmail.com',
    address: 'Novi Sad',
    profilePicture: 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
  }

  role: string = ''

  constructor (
    private readonly route: ActivatedRoute,
    private readonly userService: UserServiceService,
    public resetPasswordDialog: MatDialog,
    private readonly router: Router,
    private readonly userAuthentificationService: LoginAuthentificationService) {
    // this.imageSrc = "http://t3.gstatic.com/licensed-image?q=tbn:ANd9GcS-OZTPpZNsnOchlOMmYsSeMprn5sYU4kdOZGPL0_ksM2nHGegFrzLhGlQMBF-amQqPRFs4DzbLrI_o5gA";
    // this.imageSrc = "https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg?resize=768,512";
  }

  isDriverOrPassenger = true

  changingInformationForm = new FormGroup({
    name: new FormControl(),
    lastName: new FormControl(),
    telephone: new FormControl(),
    email: new FormControl(),
    adress: new FormControl()
  })

  ngOnInit (): void {
    this.role = this.userAuthentificationService.getRole()
    if (this.userAuthentificationService.getRole() === 'ADMIN') {
      this.userService.selectedValue$.subscribe((value) => {
        this.user.id = value
        this.route.params.subscribe((params) => {
          this.userService
            .getUserById(this.user.id)
            .subscribe((fetchedUser: AppUser) => {
              this.user = fetchedUser
            })
        })
        this.changingInformationForm.disable()
        this.isDriverOrPassenger = false
      })
    } else {
      this.route.params.subscribe((params) => {
        this.userService
          .getUserById(this.userAuthentificationService.getId())
          .subscribe((fetchedUser: AppUser) => {
            this.user = fetchedUser
          })
      })
    }
  }

  submitChanges (): void {
    if (this.changingInformationForm.get('name')?.value) {
      this.user.name = this.changingInformationForm.get('name')?.value
    }
    if (this.changingInformationForm.get('lastName')?.value) {
      this.user.surname = this.changingInformationForm.get('lastName')?.value
    }
    if (this.changingInformationForm.get('telephone')?.value) {
      this.user.telephoneNumber = this.changingInformationForm.get('telephone')?.value
    }
    if (this.changingInformationForm.get('email')?.value) {
      this.user.email = this.changingInformationForm.get('email')?.value
    }
    if (this.changingInformationForm.get('adress')?.value) {
      this.user.address = this.changingInformationForm.get('adress')?.value
    }
    if (this.role === 'PASSENGER') {
      this.passengerSubmit()
    } else {
      this.driverSubmit()
    }
  }

  driverSubmit (): void {
    this.userEvent.emit(this.user)
  }

  passengerSubmit (): void {
    this.userService
      .saveChanges(this.user, this.userAuthentificationService.getId())
      .subscribe((res: any) => {
        console.log(res)
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.router.navigate(['passenger-account'])
      })
  }

  async changePicture(): Promise<void> {
    let btn: any = document.querySelector('#pic_btn');

    btn?.addEventListener('input', async (event: any) => {
      // console.log(btn.files[0].value);
      this.user.profilePicture = String(await this.toBase64(btn.files[0]));
    });

    btn.click();
  }

  toBase64 = (file: any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  openResetPasswordDialog (): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dialog = this.resetPasswordDialog.open(ResetPasswordDialogComponent)
  }
}

export interface AppUser {
  id: number
  name: string
  surname: string
  telephoneNumber: string
  email: string
  address: string
  profilePicture: string
}
