import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { LayoutService } from './layout.service';

import { MatDialog } from '@angular/material';

import { ConfigComponent } from './../config/config.component';
import { OutputComponent } from './../output/output.component';

@Component({
  selector: 'hg-config-item',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [LayoutService],
  template: `
  <div fxLayout="row" class="config-file">
    <div fxFlex="fill" >
      <button fxFlex="fill" mat-raised-button color="primary" (click)="loadConfigDialog(configFile.url)">
        {{configFile.label}}
      </button>
      </div>
    <div fxFlex="initial">
      <button mat-icon-button matTooltip="Save in own file" [disabled]="!hasResult" (click)="saveConfig()">
        <mat-icon>save</mat-icon>
      </button>
    </div>
  </div>
  `,
})
export class ConfigurationLayoutComponent implements OnInit {
  @Input() configFile;
  @Output() result = new EventEmitter<any>();

  config:any = {};
  configResult:any = {};
  hasResult = false;
  constructor(
    public dialog: MatDialog,
    private _ls: LayoutService
  ) { }

  ngOnInit() {
    this._ls.getConfig(this.configFile['url'])
        .subscribe(
          result => {
            this.config = result;
          },
          err => console.log('Error getting config from ', this.configFile['url'], err),
          () => {}
        )
        
  }  
  
  loadConfigDialog() {
    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: `Configure ${this.configFile['label']} Options`,
        notes: this.config['notes'],
        inputModel: this.config['modelJson'],
        jsonSchemaFields: this.config['jsonFields']
      }
    });
    
    dialogRef.afterClosed()
            .subscribe(res => {
              if(res) {
                this.configResult = res;
                let x = stripNulls(res)
                if(Object.keys(x).length === 0 && x.constructor === Object) {
                  this.hasResult = false;
                } else {
                  this.hasResult = true;
                }
              } 
              
            },
            err => {console.log(err)},
            () => {
              this.configured(this.configResult)
            }
            );
  }
  
  configured(c:any){
    let e = {};
    if(this.configFile['dynamic'] === true ){
      e['config'] = {}
      if(c['values']) {
        for(let i = 0; i < c['values'].length; i++){
          e['config'][c['values'][i]['key']] = c['values'][i]['value']
        }
      }
    } else {
      e['config'] = c;
    }

    e['key'] = this.configFile['key']
    if(c) {
      this.result.emit(e);
    }
  }
  
  saveConfig(){
    console.log(this.configResult);
    let widgetsFormatted = this.config;
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {site: this.configResult, file: this.configFile['key']}
    })
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

