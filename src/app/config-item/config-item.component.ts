import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { SharedService } from './../shared.service';
import { MatDialog } from '@angular/material';
import { FormComponent } from './../form/form.component';
import { OutputComponent } from './../output/output.component';

@Component({
  selector: 'hg-config-item',
  encapsulation: ViewEncapsulation.Emulated,
  providers: [SharedService],
  templateUrl: "./config-item.component.html"
})
export class ConfigItemComponent implements OnInit {
  @Input() configFile;
  @Output() result = new EventEmitter<any>();

  config:any = {};
  configResult:any = {};
  hasResult = false;
  
  configReady = false;
  
  hasNotes = false;
  notes = [];
  
  constructor(
    public dialog: MatDialog,
    private _ls: SharedService
  ) { }

  ngOnInit() {
    this._ls.getUrl(this.configFile['url'])
        .subscribe(
          result => {
            this.config = result;
          },
          err => console.log('Error getting config from ', this.configFile['url'], err),
          () => {
            this.configReady = true;
          }
        )
        
  }  
  
  loadConfigDialog() {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: `Configure ${this.configFile['label']} Options`,
        notes: [`Suggested destination: ${this.config['destination']}`],
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
      e['config'] = this.transformDynamic(c)
    } else {
      e['config'] = c;
    }

    e['key'] = this.configFile['key']
    if(c) {
      this.result.emit(e);
    }
  }
  
  transformDynamic(c){
    let result = {};
    
    if(c['values']) {
      for(let i = 0; i < c['values'].length; i++){
        result[c['values'][i]['key']] = c['values'][i]['value']
      }
    }
    return result;
  }
  
  saveConfig(){

    let out = this.configFile['dynamic'] ? this.transformDynamic(this.configResult) : this.configResult;
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        site: out, 
        file: this.configFile['key'], 
        note: (this.configFile['destination']? `Suggested location: $${this.configFile['destination']}` : "")
      }
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

