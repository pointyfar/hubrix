import { NgModule } from '@angular/core';

import {
  MatButtonModule, 
  MatCardModule, 
  MatDialogModule, 
  MatTabsModule, 
  MatToolbarModule,
  MatTooltipModule, 
  MatSidenavModule, 
  MatIconModule
  /*
  MatAutocompleteModule, 
  MatButtonToggleModule, 
  MatPaginatorModule,
  MatCheckboxModule, 
  MatChipsModule, 
  MatDatepickerModule,
  MatGridListModule, 
  MatInputModule,
  MatListModule, 
  MatMenuModule, 
  MatProgressBarModule, 
  MatProgressSpinnerModule,
  MatRadioModule, 
  MatSelectModule, 
  MatSliderModule, 
  MatSortModule,
  MatSlideToggleModule, 
  MatSnackBarModule, 
  MatTableModule, 
  MatFormFieldModule, 
  MatExpansionModule, 
  MatStepperModule
  */
} from '@angular/material';

@NgModule({

  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule,
    MatIconModule
    /*
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatStepperModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
    */
  ]
})
export class MaterialModule {}
