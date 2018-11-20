import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormGroup} from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';

@Component({
  selector: 'wec-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ConfigComponent implements OnInit {
  form = new FormGroup({});
  
  inputOptions: FormlyFormOptions = {};
  inputFields: FormlyFieldConfig[] = [];
  
  inputModel: any = {};
  jsonSchemaFields: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    private formlyJsonschema: FormlyJsonschema,
    public dialogRef: MatDialogRef<ConfigComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
  }
  

  ngOnInit() {
    let x = this.formlyJsonschema.toFieldConfig(this.data.jsonSchemaFields);
    this.fields = [x];
    this.inputOptions = this.data.inputOptions
    this.inputFields = this.data.inputFields
    this.inputModel = this.data.inputModel
    this.jsonSchemaFields = this.data.jsonSchemaFields
    
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
