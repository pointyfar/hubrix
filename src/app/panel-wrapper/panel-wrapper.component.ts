import { Component, ViewContainerRef, ViewChild } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'hg-panel-wrapper',
  templateUrl: './panel-wrapper.component.html'
})
export class PanelWrapperComponent extends FieldWrapper {
  @ViewChild('fieldComponent', {read: ViewContainerRef, static: true}) fieldComponent: ViewContainerRef;

}
