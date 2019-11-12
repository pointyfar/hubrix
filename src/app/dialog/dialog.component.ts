import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'hg-dialog',
  templateUrl: './dialog.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogComponent implements OnInit {
  
  title: "";
  text: "";
  markdownify: true;
  
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }


  ngOnInit() {
    this.title = this.data.title;
    this.text = this.data.text;
    this.markdownify = this.data.markdownify;
    
  }

}
