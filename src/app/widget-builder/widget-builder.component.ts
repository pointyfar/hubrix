import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { DialogComponent } from './../dialog/dialog.component';
import { SharedService } from './../shared.service';
import { MatDialog } from '@angular/material';
import { WidgetItem } from './../models/widget.item';


@Component({
  selector: 'hg-wb',
  templateUrl: './widget-builder.component.html',
  styleUrls: ['./widget-builder.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WidgetBuilderComponent implements OnInit {
  @Input() public helpText: string;
  @Input() public widgetsPath: string;
  @Input() public mainSection: any[] = [];
  
  @Output() removeWidget = new EventEmitter<any>();
  

  droppableItemClass = (item: any) => `${item.class} ${item.inputType} x`;

  widgets: WidgetItem[] = [];
  groupedWidgets: any[] = [];
  structuresWidgets: any[] = [];
  contentsWidgets: any[] = [];
  
  isReady = false;


  constructor(
    public dialog: MatDialog,
    private _ls: SharedService
    
  ) { }

  ngOnInit() {
    this.getWidgetsList() 
  }
  
  getWidgetsList() {
    this._ls.getWidgetsConfig(this.widgetsPath)
        .subscribe(
          config => {
            this.widgets = config.widgets;
            this.groupedWidgets = this.processWidgets(config.widgets, config.groups);
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
  
  removeFromLayout(e,i,j,k) {
    let r = {e,i,j,k}
    this.removeWidget.emit(r)
  }
  
  processWidgets(w, s){
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
    processed.sort((a,b) => { 
      let val = 0;
      let ai = s.indexOf(a.group);
      let bi = s.indexOf(b.group);
      if (ai < 0 ) {
        if ( bi < 0 ) {
          val = a.group < b.group ? -1 : 0 
        } else { val = -1 }
      } else {
        if ( bi < 0  ) {
          val = -1
        } else { val = ai < bi ? -1 : 0 }
      }
      return val
    })

    return processed
  }
  
  launchHelp(m){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '1000px',
      height: '90%',
      data: {
        title: "Help",
        text: this.helpText,
        markdownify: m
      }
    });
    
  }

}
