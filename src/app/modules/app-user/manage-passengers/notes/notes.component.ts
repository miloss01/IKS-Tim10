import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { ManagePassengersService, NoteDTO } from '../service/manage-passengers.service';

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

  message: string = "Write your message.";

  private notesValue$ = new BehaviorSubject<any>({});
  selectedValue$ = this.notesValue$.asObservable();

  setValue(test: any) {
    this.notesValue$.next(test);
  }

  notes : NoteDTO[] = []

  ngOnInit(): void {
    this.manageService.getNotes(this.data.userId).subscribe((value) => {
      this.setValue(value.results);
      this.notesValue$.subscribe((value) => {
        this.notes = value;
        console.log(JSON.stringify(this.notes))
      })
    })
  }

  onSubmitClick() {
    console.log();
    this.manageService.submitNote(this.data.userId, this.message).subscribe((value) => {
      this.notes.push(value);
      this.setValue(this.notes);
      this.notesValue$.subscribe((value) => {
        this.notes = value;
        console.log("Supposed to be changed this.notes" + JSON.stringify(this.notes))
      })
      console.log("Response from submit note: " + JSON.stringify(value));
      console.log("Last element of array" + JSON.stringify(this.notes.at(this.notes.length-1)));
    });
  }

}
