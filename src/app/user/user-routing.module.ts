import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";
// import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from "./verify-email/verify-email.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

const routes: Routes = [
  { path: "login", component: LoginComponent, runGuardsAndResolvers: "always" },
  { path: "signup", component: SignUpComponent },
  { path: "forgot-password", component: ForgotPasswordComponent },
  { path: "verify-email/:userId", component: VerifyEmailComponent },
  { path: "reset-password/:validationToken", component: ResetPasswordComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],

  declarations: []
})
export class UserRoutingModule {}
