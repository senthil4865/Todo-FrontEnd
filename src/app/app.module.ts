import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { UserModule } from "./user/user.module";
import { MaterialModule } from "./material-module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ServerErrorComponent } from "./server-error/server-error.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { AppService } from "./app.service";

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, ServerErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    CommonModule,
    UserModule,
    FlexLayoutModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 7000,
      positionClass: "toast-top-right",
      preventDuplicates: true
    })
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
