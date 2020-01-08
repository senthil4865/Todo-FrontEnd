import { Component, OnInit } from "@angular/core";
import { SocketService } from "../../socket.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { AppService } from "../../app.service";
import { Router } from "@angular/router";

@Component({
  selector: "friend-request-sent",
  templateUrl: "./friend-request-sent.component.html",
  styleUrls: ["./friend-request-sent.component.css"],
  providers: [SocketService]
})
export class FriendRequestSentComponent {
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public userList: any[] = [];
  public friendsList: any[] = [];

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService
  ) {}

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.getRequestsSent();
    this.socketService.notify(this.userId).subscribe(data => {
      this.getRequestsSent();
    });
    this.verifyUserConfirmation();
  }


  //Function to get all requests sent by a user
  getRequestsSent() {
    this.appService
      .getRequestsSent(this.userId, this.authToken)
      .subscribe(apiResponse => {

        if (apiResponse.status == 200) {
          this.friendsList = [];
          apiResponse.data[0]["friendRequestSent"].forEach(friend => {
            this.friendsList.push(friend);
          });
        }
      });
  }


  //Function to cancel friend request and to send notification to respective users
  cancelFriendRequest(friend) {
    let cancelRequestOption = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: friend.friendId,
      receiverName: friend.friendName,
      authToken: this.authToken
    };
    this.appService.cancelRequest(cancelRequestOption).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.toastr.success("Friend Request Cancelled", "Success");

          let senderNotifyObj = {
            receiverName: this.userName,
            receiverId: this.userId,
            senderName: friend.friendName,
            senderId: friend.friendId,
            redirectId: "friend",
            message: `You have cancelled the friend request sent to ${cancelRequestOption.senderName}`,
            authToken: this.authToken
          };
          this.appService
            .saveUserNotification(senderNotifyObj)
            .subscribe(apiResponse => {
              if (apiResponse.status == 200) {
                this.socketService.sendNotify(senderNotifyObj);
              }
            });

          let ReceiverNotifyObj = {
            senderName: this.userName,
            senderId: this.userId,
            receiverName: friend.friendName,
            receiverId: friend.friendId,
            redirectId: "friend",
            message: `${cancelRequestOption.senderName} has cancelled his friend request sent to you`,
            authToken: this.authToken
          };
          this.appService
            .saveUserNotification(ReceiverNotifyObj)
            .subscribe(apiResponse => {
              if (apiResponse.status == 200) {
                this.socketService.sendNotify(ReceiverNotifyObj);
              }
            });

          this.getRequestsSent();
        } else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
      error => {
        if ((error.status = 400)) {
          this.toastr.warning(
            "Failed to cancel Friend Request",
            "one or more fields are missing"
          );
        } else {
          this.toastr.error("some error occured", "Error!");
          this.router.navigate(["/serverError"]);
        }
      }
    );
  }


  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser()
      .subscribe(() => {
        this.socketService.setUser(this.authToken);//in reply to verify user emitting set-user event with authToken as parameter.
      },
        (err) => {
          this.toastr.error(err, "Some error occured");
        });//end subscribe
  }//end verifyUserConfirmation

}
