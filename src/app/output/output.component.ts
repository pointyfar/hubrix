import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormControl} from '@angular/forms';
import * as yamljs from 'yamljs';
import * as tomlify from 'tomlify-j0.4';
import * as FileSaver from 'file-saver/src/FileSaver';

@Component({
  selector: 'hg-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class OutputComponent implements OnInit {
  
  jsonFormat: any = {};
  jsonData: "";
  yamlData: "";
  tomlData: "";
  codeOptions = ["JSON", "YAML", "TOML"];
  selectedCode = "JSON";
  hasY = false;
  hasT = false;
  note = "";
  selected = new FormControl(0);
  
  constructor(
    public dialogRef: MatDialogRef<OutputComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.note = this.data.note? this.data.note : "";

    let site = stripNulls(this.data.site);
    let config = {};
        config = site;
    
    if(this.data.widgets) {
      if (this.data.widgets.length > 0) {
        if(!config.hasOwnProperty('params')){
          config['params'] = {};
        }
        config['params']['widgets'] = this.data.widgets;
      }
    }
    
    for(let k in config){
      if(config.hasOwnProperty(k)){
        if((typeof config[k]) !== "object"){
          this.jsonFormat[k] = config[k]
        }
      }
    }
    /* Make sure objects are last */
    for(let k in config){
      if(config.hasOwnProperty(k)){
        if((typeof config[k]) === "object"){
          this.jsonFormat[k] = config[k]
        }
      }
    }
    
    this.getYaml(this.jsonFormat)
    this.getToml(this.jsonFormat)
  }
  
  getYaml(data) {
    try {
      let doc = yamljs.stringify(data, 5, 2); 
        this.yamlData = doc;
        this.hasY = true;
    } catch (e) {
      console.log('error!',e);
    }
    
  }
  
  getToml(data) {
    try {
      this.tomlData = tomlify.toToml(data, {
        space: 2, // indent with 2 spaces
        replace: function (key, value) {
            if( 
              ((typeof value) === (typeof 1.0)) &&
              ( value % 1 === 0 )
            ) {
              return value.toFixed(0)
            }
            return false;
        }
      });
      this.hasT = true;
    } catch (err) {
      console.log('error!',err);
    }
  }
  
  copyToClipboard(containerid) {
    let elementId = `copy${this.codeOptions[containerid]}`;
    let textarea = document.createElement('textarea');
    textarea.id = 't';
    textarea.style.height = '0';
    document.body.appendChild(textarea);
    textarea.value = document.getElementById(elementId).innerText;
    let selector = <any>document.querySelector('#t');
    selector.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  
  tab($event) {
    this.selected.setValue($event);
  }
  
  downloadCode(code) {
    let blob;

    let filename = (this.data['file'].length > 0 ? this.data['file'] : "config") + "." + this.codeOptions[code].toLowerCase();

    switch(this.codeOptions[code]) {
      case "JSON": {
        blob = new Blob([JSON.stringify(this.jsonFormat,null,2)], {type : 'application/json'});
        break;  
      }
      case "YAML": {
        blob = new Blob([this.yamlData], {type : 'text/plain'});
        break;
      }
      case "TOML": {
        blob = new Blob([this.tomlData], {type : 'text/plain'});
        break;
      }
    }
    FileSaver.saveAs(blob, filename);
  }
  cancel(): void {
      this.dialogRef.close();
    }
}

function stripNulls(o) {

  let newObj = JSON.parse(JSON.stringify(o));
  for (var k in newObj) {
    if(newObj[k] === false) {
      continue
    } else if (!newObj[k] || ((typeof newObj[k]) !== "object")) {
      if ( !newObj[k]) {
        // if null
        delete newObj[k]
        continue
      } else {
        continue 
      }
    }
    // The property is an object
    newObj[k] = stripNulls(newObj[k]); // <-- Make a recursive call on the nested object
    if (Object.keys(newObj[k]).length === 0) {
      delete newObj[k]; // The object had no properties, so delete that property
    }
  }
  return newObj
}
