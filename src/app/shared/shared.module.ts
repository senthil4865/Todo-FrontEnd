import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { DialogBoxComponent } from "./dialog-box/dialog-box.component";
import { ToastrModule } from "ngx-toastr";

import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatDialogModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatBadgeModule
} from "@angular/material";

import { NavbarComponent } from "./navbar/navbar.component";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDialogModule,
    NgbModalModule,
    ReactiveFormsModule,
    RouterModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-top-right",
      preventDuplicates: true
    })
  ],

  declarations: [NavbarComponent, DialogBoxComponent],

  exports: [NavbarComponent, CommonModule, FormsModule, DialogBoxComponent],

  entryComponents: [DialogBoxComponent]
})
export class SharedModule {}
