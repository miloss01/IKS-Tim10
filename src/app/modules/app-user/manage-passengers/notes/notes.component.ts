import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManagePassengersService } from '../service/manage-passengers.service';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotesComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private manageService: ManagePassengersService
) { }

  // messageFieldForm = new FormGroup( {
  //   noteMessage: new FormControl()
  // })

  message: string = "Write your message.";


  ngOnInit(): void {
  }

  onSubmitClick() {
    console.log();
    this.manageService.submitNote(this.data.userId, this.message).subscribe((value) => {
      this.message = "";
      console.log("Response from submit note: " + JSON.stringify(value));
    });
  }

}
