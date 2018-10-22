import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatSidenavModule, MatExpansionModule, MatDatepickerModule, MatNativeDateModule,
  MatListModule, MatButtonModule, MatDialogModule, MatMenuModule, MatIconModule
} from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
  ],
  exports: [
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
  ],
})
export class MaterialComponentsModule { }
