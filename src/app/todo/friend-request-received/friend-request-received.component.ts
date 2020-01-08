import { Component, OnInit } from "@angular/core";
import { SocketService } from "../../socket.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { AppService } from "src/app/app.service";
import { Router } from "@angular/router";

@Component({
  selector: "friend-request-received",
  templateUrl: "./friend-request-received.component.html",
  styleUrls: ["./friend-request-received.component.css"],
  providers: [SocketService]
})
export class FriendRequestReceivedComponent {
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
    this.getRequestsReceived();
    this.socketService.notify(this.userId).subscribe(data => {
      this.getRequestsReceived();
    });
     this.verifyUserConfirmation();
  }


  //Function to get all received requests
  getRequestsReceived() {
    this.appService
      .getRequestsReceived(this.userId, this.authToken)
      .subscribe(apiResponse => {
        if (apiResponse.status == 200) {
          this.friendsList = [];
          apiResponse.data[0]["friendRequestReceived"].forEach(friend => {
            this.friendsList.push(friend);
          });
        }
      });
  }

  //Function to accept friend requests and send notification to respective users
  AcceptFriendRequest(friend) {
    const friendRequestAccept = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: friend.friendId,
      receiverName: friend.friendName,
      authToken: this.authToken
    };
    this.appService.acceptRequest(friendRequestAccept).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          //  this.toastr.success("Friend Request Accepted","Success");

          let senderNotifyObj = {
            receiverName: this.userName,
            receiverId: this.userId,
            senderName: friend.friendName,
            senderId: friend.friendId,
            redirectId: "friend",
            message: `You and ${friendRequestAccept.senderName} are friends`,
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
            message: `You and ${friendRequestAccept.senderName} are friends`,
            authToken: this.authToken
          };
          this.appService
            .saveUserNotification(ReceiverNotifyObj)
            .subscribe(apiResponse => {
              if (apiResponse.status == 200) {
                this.socketService.sendNotify(ReceiverNotifyObj);
              }
            });

          this.getRequestsReceived();
        } else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
      error => {
        if ((error.status = 400)) {
          this.toastr.warning(
            "Failed to Accept Friend Request",
            "one or more fields are missing"
          );
        } else {
          this.toastr.error("some error occured", "Error!");
          this.router.navigate(["/serverError"]);
        }
      }
    );
  }

  RejectFriendRequest(friend) {
    let cancelRequestOption = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: friend.friendId,
      receiverName: friend.friendName,
      authToken: this.authToken
    };
    this.appService.rejectFriendRequest(cancelRequestOption).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          this.toastr.success("Friend Request Rejected", "Success");

          let senderNotifyObj = {
            receiverName: this.userName,
            receiverId: this.userId,
            senderName: friend.friendName,
            senderId: friend.friendId,
            redirectId: "friend",
            message: `You have Rejected the friend came from ${cancelRequestOption.senderName}`,
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
            message: `${cancelRequestOption.senderName} has Rejected your friend request`,
            authToken: this.authToken
          };
          this.appService
            .saveUserNotification(ReceiverNotifyObj)
            .subscribe(apiResponse => {
              if (apiResponse.status == 200) {
                this.socketService.sendNotify(ReceiverNotifyObj);
              }
            });

          this.getRequestsReceived();
        } else {
          this.toastr.error(apiResponse.message, "Error!");
        }
      },
      error => {
        if ((error.status = 400)) {
          this.toastr.warning(
            "Failed to Reject Friend Request",
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
