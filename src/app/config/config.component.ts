import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormGroup} from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'wec-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ConfigComponent implements OnInit {
  form = new FormGroup({});
  
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  model: any = {};
  
  title = "";

  constructor(
    public dialogRef: MatDialogRef<ConfigComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }
  

  ngOnInit() {
    this.model = this.data.inputModel
    this.fields = this.data.jsonSchemaFields
    this.title = this.data.title
  }
  saveForm(){
    if (this.form.valid) {
      this.data.result = this.form.value;
      this.dialogRef.close(this.form.value);
    }
  }
  cancel(): void {
      this.dialogRef.close();
    }
}
