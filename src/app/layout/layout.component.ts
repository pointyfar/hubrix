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
        g = "UNGROUPED";
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

  loadComponent(e) {
    console.log(e)

  }

  attachConfig(e, m) {
    m.result = e.config;
  }

  generateConfig() {
    let widgetsFormatted = this.formatWidgetsConfig(this.mainSection)
    this.openGenerateConfDialog(widgetsFormatted, this.formattedSiteConfig);
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

  builderDrag(e: any) {
    const item = e.value;
    item.data =
      item.inputType === 'number'
        ? (Math.random() * 100) | 0
        : Math.random()
          .toString(36)
          .substring(20);
  }

  log(e: any) {
    console.log(e.type, e);
  }

  canMove(e: any): boolean {
    return e.indexOf('Disabled') === -1;
  }
  
  openGenerateConfDialog(widgets:any, site:any): void {
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {widgets: widgets, site: site}
    })
  }
  
  configSite(){
    this.siteConfigDone = true;
    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '1000px',
      height: '500px',
      data: {
        title: "Configure Hugo Site",
        inputModel: this.siteConfig.modelJson,
        jsonSchemaFields: this.siteConfig.jsonFields
      }
//      data: {inputModel: this.model, inputFields: this.formFields, jsonSchemaFields: this.jsonSchemaFields, result: this.res}
    });
    
    let result;
    dialogRef.afterClosed()
            .subscribe(x => {
              result = x;  
              },
              err => {console.log(err)},
              () => {
                this.formattedSiteConfig = result;
              }
            );
  }
  

}
