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
  
  selected = new FormControl(0);
  
  constructor(
    public dialogRef: MatDialogRef<OutputComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    let site = this.data.site;
    for(let k in site) {
      if( (site[k] === null ) || 
        (( (typeof site[k] ) === (typeof []) ) && site[k].length == 0)
      ) {
      } else {
        this.jsonFormat[k] = site[k]
        
      }

    }
    this.jsonFormat['params'] = {};
    this.jsonFormat['params']['widgets'] = this.data.widgets;
    
    //this.yamlData = 
    this.getYaml(this.jsonFormat)
    //this.tomlData = 
    this.getToml(this.jsonFormat)
    // this.yamlFormat = multigrain.yaml(this.jsonFormat);
    // this.tomlFormat = multigrain.toml(this.jsonFormat);
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
    let filename = "config." + this.codeOptions[code].toLowerCase();
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
