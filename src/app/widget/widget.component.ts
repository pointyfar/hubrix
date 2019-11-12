import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { LayoutService } from './../layout/layout.service';
import { MatDialog } from '@angular/material';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormComponent } from './../form/form.component';
import { WidgetService } from './widget.service';

@Component({
  selector: 'hg-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [WidgetService]
})
export class WidgetComponent implements OnInit {
  data = "hello";
  qReady = false;
  
  @Input() public qpath: string;
  @Input() public title: string;
  @Input() public image: string;
  @Input() public contentUrl: string;
  @Output() widgetConfig = new EventEmitter<any>();
  @Output() removeWidget = new EventEmitter<any>();
  
  description = "";
  model: any = {};
  formFields: FormlyFieldConfig[] = [];
  
  jsonSchemaFields:FormlyFieldConfig[] = [];
  res: any = {};
  hasResult = false;
  
  constructor(
    private _ls: LayoutService,
    private _ws: WidgetService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getQuestions();
  }
  
  widgetConfigured(c:any){
    let e = {config: c}
    if(c) {
      this.widgetConfig.emit(e);
    }
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '1000px',
      height: '500px',
      data: {
        inputModel: this.model, 
        inputFields: this.formFields, 
        jsonSchemaFields: this.jsonSchemaFields, 
        result: this.res,
        title: `Configure ${this.title}`
      }
    });
    let result;
    dialogRef.afterClosed()
            .subscribe(x => {
              result = x;  
              this.res = x;
              },
              err => {console.log(err)},
              () => {
                this.widgetConfigured(result)
                if(result) {
                  this.hasResult = true;
                }
              }
            );
  }
  
  getQuestions(){
    let url = this.qpath;
    
    this._ls.getConfig(url)
        .subscribe(
          r => {
            this.model = r.modelJson;
            this.description = r.description;
            this.jsonSchemaFields = r.jsonFields;
          },
          err => {
            console.log('error:', err)
          },
          () => {
            this.qReady = true;
          }
        );
  }
  
  removeWidgetEvent(e){
    this.removeWidget.emit(e);
    
  }
  
}
