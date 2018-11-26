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

  widgets: WidgetItem[] = [];
  isReady = false;

  testurl = "assets/widgets-alt.json";
  
  targetBuilderTools: any[] = [];

  mainSection: any[] = [];

  droppableItemClass = (item: any) => `${item.class} ${item.inputType}`;

  formattedConfig: any = {};
  
  groupedWidgets: any[] = [];
  
  siteConfig:any = {};
  formattedSiteConfig: any = {};
  siteConfigDone = false;
  
  paramsConfig = {};
  paramsConfigDone = false;
  formattedParamsConfig = {};
  
  constructor(
    public dialog: MatDialog,
    private _ls: LayoutService
  ) { }

  ngOnInit() {
    this.getWidgetsList();
  }

  getWidgetsList() {
    this._ls.getConfigs(this.widgetsPath)
        .subscribe(
          config => {
            this.widgets = config.widgets;
            this.groupedWidgets = this.processWidgets(config.widgets)
            this.siteConfig = config.site;
            this.paramsConfig = config.params;
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
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {widgets: widgetsFormatted, site: this.formattedSiteConfig}
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
      } else { /** Functional Widget **/
        f['config'] = widgetConf[i]['result'];
        f['type'] = "widget"

      }
      list.push(f)
    }
    return list

  }

  
  loadHugoConfigDialog(){
    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Configure Hugo Site",
        inputModel: this.siteConfig.modelJson,
        jsonSchemaFields: this.siteConfig.jsonFields
      }
    });
    
    dialogRef.afterClosed()
            .subscribe(result => {
              if(result) {
                this.formatSiteConfig(result);
                this.siteConfigDone = true;
              } 
              },
              err => {console.log(err)},
              () => {
              }
            );
  }
  
  loadParamsConfigDialog(){
    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Configure Site Params",
        inputModel: this.paramsConfig['modelJson'],
        jsonSchemaFields: this.paramsConfig['jsonFields']
      }
    });
    
    dialogRef.afterClosed()
            .subscribe(result => {
              if(result) {
                this.formatParamsConfig(result);
                this.paramsConfigDone = true;
              } 
              },
              err => {console.log(err)},
              () => {
              }
            );
  }
  
  formatSiteConfig(config){
    /* Format Menus */
    let menus = [];
    if(config.hasOwnProperty("menu")){
      if(config['menu']['menuConfig']){
        if(config['menu']['menuConfig'].length > 0){
          let c = config['menu']['menuConfig'];
          for( let i = 0 ; i < c.length; i++ ){
            let menu = {};
            let label = c[i]['menuName'];
            let items = c[i]['menuItems'];
            menu[label] = items;
            menus.push(menu);
          }
        }
      }
    }
    if( menus.length > 0 ) {
      config['menu'] = menus;
    }
    
    for(let k in config){
      this.formattedSiteConfig[k] = config[k]
    }

  }
  
  formatParamsConfig(config:any) {

    if(!this.formattedSiteConfig.hasOwnProperty('params')) {
      this.formattedSiteConfig['params'] = {};
    }
    
    for(let k in config){
      if(config.hasOwnProperty(k)){
        this.formattedSiteConfig['params'][k] = config[k]
      }
    }
  }
  
  
  

}

