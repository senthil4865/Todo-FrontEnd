import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Cookie } from "ng2-cookies/ng2-cookies";

import { AppService } from "../../app.service";
// import { SocketService } from '../../socket.service';

import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { SocketService } from "../../socket.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  @Input() active: string;
  public userId: string;
  public userName: string;
  public authToken: string;
  public activeNav: any;
  notifications: any[] = [];
  count: number = null;
  noNotify: boolean = false;

  constructor(
    public SocketService: SocketService,
    public snackBar: MatSnackBar,
    public router: Router,
    public _route: ActivatedRoute,
    public appService: AppService,
    public toastr: ToastrService,
    public socketService: SocketService
  ) {}

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");

    this.activeNav = this.active;
    this.getNotify();
  }

  public logoutFunction = () => {
    this.appService.logout(this.userId, this.authToken).subscribe(
      apiResponse => {
        if (apiResponse.status === 200) {
          localStorage.clear();
          Cookie.delete("authToken"); //delete all the cookies
          Cookie.delete("userId");
          Cookie.delete("userName");
          this.socketService.exitSocket();
          this.router.navigate(["/user/login"]); //redirects the user to login page.
        } else {
          this.toastr.error(apiResponse.message, "Error!");
          this.router.navigate(["/serverError"]); //in case of error redirects to error page.
        } // end condition
      },
      err => {
        if (err.status == 404) {
          this.toastr.warning(
            "Logout Failed",
            "Already Logged Out or Invalid User"
          );
          this.router.navigate(["/user/login"]);
        } else {
          this.toastr.error("Some Error Occurred", "Error!");
          this.router.navigate(["/serverError"]);
        }
      }
    );
  }; //end logout

  getNotification(id) {
    this.notifications = [];

    this.noNotify = false;

    this.appService.getUserNotification(id).subscribe(
      data => {
        if (data["status"] === 200) {
          let response = data["data"];
          this.notifications = [];
          if (response != null) {
            response.map(x => {
              this.notifications.unshift(x);
            });
          }
        } else if (data["status"] === 404) {
          this.noNotify = true;
        } else {
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 5000
          });

          setTimeout(() => {
            this.router.navigate(["/serverError"]);
          }, 500);
        }
      },
      err => {
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    );
  }

  // get notifications of the user
  public getNotify: any = () => {
    this.userId = this.appService.getUserInfoFromLocalStorage().userId;

    this.SocketService.notify(this.userId).subscribe(
      data => {
        this.noNotify = false;

        let message = data;
        this.notifications.unshift(message);
        this.count+=1;
      },
      err => {
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    );
  };

  /**
   * clearNotification
   */
  public clearNotify() {
    this.userId = this.appService.getUserInfoFromLocalStorage().userId;

    this.count = null;

    this.getNotification(this.userId);
  }
}
