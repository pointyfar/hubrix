import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { LayoutService } from './layout.service';
import { WidgetItem } from './../models/widget.item';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output/output.component';
import { ConfigComponent } from './../config/config.component';

@Component({
  selector: 'hg-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [LayoutService]
})
export class LayoutComponent implements OnInit {

  @Input() public widgetsPath: string;
  @Input() public configPath: string;
  @Input() public assetsBasePath: string;

  config: any = {};
  
  widgets: WidgetItem[] = [];
  isReady = false;

  notes = "Save as config.(json/toml/yaml)"
  
  targetBuilderTools: any[] = [];

  mainSection: any[] = [];

  droppableItemClass = (item: any) => `${item.class} ${item.inputType}`;

  groupedWidgets: any[] = [];
  
  containerWidgetConfig = {};
  containerWidgetForm = "";
  
  
  configFiles = [];
  configFilesDone = true;
  
  constructor(
    public dialog: MatDialog,
    private _ls: LayoutService
  ) { }

  ngOnInit() {
    this.getWidgetsList();
    this.assetsBasePath = this.assetsBasePath.slice(-1) == "/" ? this.assetsBasePath : this.assetsBasePath + "/";
    this.getConfigFiles();
  }

  getWidgetsList() {
    this._ls.getWidgetsConfig(this.widgetsPath)
        .subscribe(
          config => {
            console.log(config)
            this.widgets = config.widgets;
            this.groupedWidgets = this.processWidgets(config.widgets)
          },
          err => {
            console.log(err)
          },
        () => {
          this.isReady = true;
        }
      )
      ;
  }
  
  processWidgets(w){
    let groups = [];
    let processed = [];
    
    for (let i=0; i<w.length; i++) {
      let g = ""
      
      if(w[i].hasOwnProperty('group')) {
        g = w[i]['group']; 
      } else {
        g = "ungrouped";
      }

      if( groups.indexOf(g) >= 0 ){
        for(let j = 0; j< processed.length; j++){
          if(processed[j]['group'] === g){
            processed[j]['items'].push(w[i])
          }
        }
      } else {
        groups.push(g);
        let item = [w[i]];
        processed.push({group: g, items: item});
      }
    }

    return processed
  }

  attachConfig(e, m) {
    m.result = e.config;
  }

  generateConfig() {
    let widgetsFormatted = this.formatWidgetsConfig(this.mainSection);
    console.log(widgetsFormatted)
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {
        widgets: widgetsFormatted, 
        site: this.config,
        note: this.notes
        
      }
    })
  }

  formatWidgetsConfig(widgetConf: any) {
    
    let list = [];
    for (let i = 0; i < widgetConf.length; i++) {

      let f = {};
      f['widgetName'] = widgetConf[i]['name'];
      f['class'] = widgetConf[i]['class'];

      /** Section Widget **/
      if (widgetConf[i].hasOwnProperty('children')) {
        if (widgetConf[i]['children'].length > 0) {
          f['items'] = this.formatWidgetsConfig(widgetConf[i]['children']);
        }
        f['flex'] = widgetConf[i]['flex'];
        f['type'] = "section"
        f['config'] = widgetConf[i]['result']
      } else { /** Functional Widget **/
        f['config'] = widgetConf[i]['result'];
        f['type'] = "widget"

      }
      list.push(f)
    }
    return list

  }

  
  getContainerConfig(e, m){
    if(!this.containerWidgetForm || (this.containerWidgetForm !== m['formConfig'])) {
      this._ls.getConfig(m['formConfig'])
      .subscribe(
        c => {
          this.containerWidgetConfig = c
        },
        err => {
          console.log("Error getting Container Config", err)
        },
        () => {
          this.containerWidgetForm = m['formConfig']
          this.launchContainerSettings(this.containerWidgetConfig, m)
        }
      )
    } else {
      this.launchContainerSettings(this.containerWidgetConfig, m)
    }
    
  }
  
  launchContainerSettings(container, model) {

    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Configure Site Params",
        inputModel: container['modelJson'],
        jsonSchemaFields: container['jsonFields']
      }
    });
    
    dialogRef.afterClosed()
            .subscribe(result => {
                if(result) {
                  model['result'] = result
                } 
              },
              err => {console.log(err)},
              () => {
              }
            );
    
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
  
  setConfigValue(e){
    if(e['key'].length === 0) {
      copyObj(e['config'], this.config)
    } else {
      for(let i = 0; i < e['key'].length; i++ ){
        this.config[e['key'][i]] = {};
        copyObj(e['config'], this.config[e['key'][i]])
      }
    }
  }
  
}

function copyObj(src, dest){
  
  for(let k in src) {
    if(src.hasOwnProperty(k)){
      dest[k] = src[k]
    }
  }
  return dest
}

