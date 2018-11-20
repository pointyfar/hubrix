import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { LayoutService } from './layout.service';
import { WidgetItem } from './../models/widget.item';
import { MatDialog } from '@angular/material';
import { OutputComponent } from './../output/output.component';

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


  targetBuilderTools: any[] = [];

  mainSection: any[] = [];

  droppableItemClass = (item: any) => `${item.class} ${item.inputType}`;

  formattedConfig: any = {};

  constructor(
    public dialog: MatDialog,
    private _ls: LayoutService
  ) { }

  ngOnInit() {
    this.getWidgetsList();
  }

  getWidgetsList() {
    this._ls.getWidgetsList(this.widgetsPath)
      .subscribe(
        wi => {
          this.widgets = wi;
        },
        err => {
          console.log(err)
        },
        () => {
          this.isReady = true;
          console.log("ready");
        }
      )
      ;
  }

  loadComponent(e) {
    console.log(e)

  }

  attachConfig(e, m) {
    m.result = e.config;
  }

  generateConfig() {
    let formatted = this.formatConfig(this.mainSection)
    this.formattedConfig = formatted;
    this.openDialog(formatted);
  }

  formatConfig(c: any) {
    let list = [];
    for (let i = 0; i < c.length; i++) {

      let f = {};
      f['widgetName'] = c[i]['name'];
      f['class'] = c[i]['class'];

      /** Section Widget **/
      if (c[i].hasOwnProperty('children')) {
        if (c[i]['children'].length > 0) {
          f['items'] = this.formatConfig(c[i]['children']);
        }
        f['flex'] = c[i]['flex'];
        f['type'] = "section"
      } else { /** Functional Widget **/
        f['config'] = c[i]['result'];
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
  
  openDialog(output:any): void {
    const dialogRef = this.dialog.open(OutputComponent, {
      width: '1000px',
      height: '500px',
      data: {output: output}
    });

  }

}
