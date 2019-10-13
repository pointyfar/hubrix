import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Injector} from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

import { MarkdownModule } from 'ngx-markdown';

import { LayoutComponent } from './layout/layout.component';
import { ConfigurationLayoutComponent } from './layout/configuration.layout.component';
import { ArrayTypeComponent } from './models/formly.array';
import { ConfigComponent } from './config/config.component';

/* Widgets */
import { WidgetComponent } from './widget/widget.component';
import { OutputComponent } from './output/output.component';
import { PanelWrapperComponent } from './panel-wrapper/panel-wrapper.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ConfigurationLayoutComponent,
    ArrayTypeComponent,
    ConfigComponent,
    WidgetComponent,
    OutputComponent,
    PanelWrapperComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    NgxDnDModule,
    MarkdownModule.forRoot(),
    HttpClientModule,
    FormlyMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
      types: [
        { name: 'string', extends: 'input' },
        {
          name: 'number',
          extends: 'input',
          defaultOptions: {
            templateOptions: {type: 'number'},
          }
        },
        {
          name: 'integer',
          extends: 'input',
          defaultOptions: {
            templateOptions: {
              type: 'number',
            }
          }
        },
        { name: 'object', extends: 'formly-group' },
        { name: 'boolean', extends: 'checkbox' },
        { name: 'array', component: ArrayTypeComponent },
        { name: 'enum', extends: 'select' }
      ],
      wrappers: [
        { name: 'panel', component: PanelWrapperComponent },
      ],
    })
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //bootstrap: [AppComponent],
  //bootstrap: [LayoutBasicComponent],
  entryComponents :  [
     LayoutComponent,
     ConfigComponent,
     OutputComponent
  ]})
export class AppModule {
  /*  ngDoBootstrap(){
      const el = createCustomElement(ConfigComponent, {injector : this.injector});
      customElements.define('wec-config',el);
    }*/
    
    constructor(private injector: Injector) {
     const lc = createCustomElement(LayoutComponent, { injector });
     customElements.define('hg-layout', lc);
   }

   ngDoBootstrap() {}
}
