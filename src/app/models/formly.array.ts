import { Component } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';

@Component({
  selector: 'formly-array-type',
  template: `
    <div class="formly-array">
      <div>
        <div *ngIf="to.label" class="formly-array-label">
          {{ to.label }}
        </div>
        <div *ngFor="let field of field.fieldGroup" fxLayoutGap="20px" style="border-bottom: 1px solid #444">
          <div fxFlex="grow">
            <formly-field
              [field]="field"
              [options]="options"
              [form]="formControl">
            </formly-field>
          </div>
          <div fxFlex="initial" fxFlexAlign="center">
            <button mat-stroked-button color="warn" type="button" (click)="remove(i)">Remove</button>
          </div>
        </div>
      </div>

      <div>
        <button mat-raised-button type="button" (click)="add()">{{field.fieldArray.templateOptions.label}}</button>
      </div>
    </div>
    

  `,
})
export class ArrayTypeComponent extends FieldArrayType {
  constructor(builder: FormlyFormBuilder) {
    super(builder);
  }
}