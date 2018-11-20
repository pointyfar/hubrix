import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output } from '@angular/core';
import { LayoutService } from './../layout/layout.service';
import { MatDialog } from '@angular/material';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ConfigComponent } from './../config/config.component';

@Component({
  selector: 'hg-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class WidgetComponent implements OnInit {
  data = "hello";
  qReady = false;
  
  @Input() public qpath: string;
  @Input() public title: string;
  @Output() widgetConfig = new EventEmitter<any>();
  
  model: any = {};
  formFields: FormlyFieldConfig[] = [];
  
  jsonSchemaFields: any = {};
  res: any = {};
  hasResult = false;
  
  constructor(
    private _ls: LayoutService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getQuestions();
  }
  
  widgetConfigured(c:any){
    let e = {config: c}
    this.widgetConfig.emit(e);
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(ConfigComponent, {
      width: '1000px',
      height: '500px',
      data: {inputModel: this.model, inputFields: this.formFields, jsonSchemaFields: this.jsonSchemaFields, result: this.res}
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
                this.hasResult = true;
              }
            );
  }
  
  getQuestions(){
    let url = this.qpath;
    
    this._ls.getConfigList(url)
        .subscribe(
          r => {
            this.model = r.modelJson;
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

}
