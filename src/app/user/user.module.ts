import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatCardModule
} from "@angular/material";
import { FlexLayoutModule } from "@angular/flex-layout";
import { UserRoutingModule } from "./user-routing.module";

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatCardModule,
    FlexLayoutModule,
    FormsModule
  ],
  exports: [LoginComponent]
})
export class UserModule {}
