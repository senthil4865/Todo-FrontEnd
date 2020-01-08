import { Component} from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { SocketService } from "../../socket.service";

@Component({
  selector: "app-friends",
  templateUrl: "./friends.component.html",
  styleUrls: ["./friends.component.css"]
})
export class FriendsComponent {
  public authToken: string;
  constructor(
    public socketService: SocketService,
    public toastr: ToastrService
  ) {}

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.verifyUserConfirmation();
  }

  // //listened
  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      () => {
        this.socketService.setUser(this.authToken); 
      },
      err => {
        this.toastr.error(err, "Some error occured");
      }
    ); //end subscribe
  }; //end verifyUserConfirmation
}
