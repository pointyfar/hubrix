import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { LayoutService } from './../layout/layout.service';
/*import { WidgetItem } from './../models/widget.item';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output/output.component';
import { ConfigComponent } from './../config/config.component';
import { DialogComponent } from './../dialog/dialog.component';
*/

@Component({
  selector: 'hg-cb',
  templateUrl: './config-builder.component.html',
  styleUrls: ['./config-builder.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ConfigBuilderComponent implements OnInit {
  
  @Input() public configPath: string;
  @Input() public assetsBasePath: string;
  
  @Output() emitConfig = new EventEmitter<any>();
  
  configFiles = [];
  configFilesDone = true;
  config: any = {};

  constructor(
    private _ls: LayoutService
    
  ) { }

  ngOnInit() {
    this.getConfigFiles()
    
  }
  
  getConfigFiles(){
    this._ls.getConfig(this.configPath)
        .subscribe( result => {
          for(let i = 0; i < result.files.length; i++){
            this.configFiles.push(result.files[i])
          }
        },
        err => {
          console.log("Error getting config files from ", this.configPath, err)
        },
        () => {
          this.configFilesDone = true;
        }
          
        )
  }
  
  emitConfigValue(e){
    if(e) {
      this.emitConfig.emit(e);
    }
  }

}