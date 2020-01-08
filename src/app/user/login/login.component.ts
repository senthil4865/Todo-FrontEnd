import { Component, OnInit, Input, Output } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EventEmitter } from "events";
import { AppService } from "./../../app.service";
import { ToastrService } from "ngx-toastr";
import { HttpXsrfCookieExtractor } from "@angular/common/http/src/xsrf";
import * as io from "socket.io-client";

import { Cookie } from "ng2-cookies/ng2-cookies";
import { SocketService } from "./../../socket.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email = new FormControl("", [Validators.required, Validators.email]);
  public baseUrl = "http://127.0.0.1:3000";

  public friendsList: any[] = [];
  password: any;
  socket;
  public userId: string;
  constructor(
    public appService: AppService,
    public _route: ActivatedRoute,
    public router: Router,
    private toastr: ToastrService,
    public socketService: SocketService
  ) {
    this.socket = io(this.baseUrl);
  }

  ngOnInit() {
    this.userId = Cookie.get("userId");
    this.socket.on("online-user-list", list => {
     
    });
  }

  getErrorMessage() {
    this.email.hasError("required")
      ? "You must enter a value"
      : this.email.hasError("email")
      ? "Not a valid email"
      : "";
  }

  public signInFunction(): any {
    if (!this.email.value) {
      this.toastr.warning("Email is Required", "required");
    } else if (this.email.hasError("email")) {
      this.toastr.warning("Not a valid email", "warning!");
    } else if (!this.password) {
      this.toastr.warning("Password is required", "warning!");
    } else {
      let data = {
        email: this.email.value,
        password: this.password
      };
      this.appService.signIn(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success("Login Successful", "Welcome to Todo");

            Cookie.set("authToken", apiResponse.data.authToken);
            Cookie.set("userId", apiResponse.data.userDetails.userId);
            Cookie.set(
              "userName",
              `${apiResponse.data.userDetails.firstName} ${apiResponse.data.userDetails.lastName}`
            );
            this.appService.setUserInfoInLocalStorage(
              apiResponse.data.userDetails
            );

            this.socketService.emit("Join", this.userId);

            apiResponse.data.userDetails.friends.forEach(friend => {
              this.friendsList.push(friend.friendId);
              this.socketService.emit("Join", friend);
            });

            setTimeout(() => {
              this.router.navigate(["/todo/single-user"]);
            }, 1000);
      
          } else {
            this.toastr.warning(apiResponse.message, "Error!");
          }
        },
        error => {
          if (error.status == 404) {
            this.toastr.warning(
              "Login Failed",
              "User not Found or Email is not verified"
            );
          } else if (error.status == 400) {
            this.toastr.warning("Login Failed", "Wrong password");
          } else {
            this.toastr.error("Some Error occured", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }

  loginKeyDown($event) {
    if ($event.keyCode == 13) {
      this.signInFunction();
    }
  }
}
