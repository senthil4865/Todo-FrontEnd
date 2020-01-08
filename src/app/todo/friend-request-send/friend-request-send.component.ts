import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { SocketService } from "../../socket.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { AppService } from "src/app/app.service";
import { Router } from "@angular/router";

@Component({
  selector: "friend-request-send",
  templateUrl: "./friend-request-send.component.html",
  styleUrls: ["./friend-request-send.component.css"],
  providers: [SocketService]
})
export class FriendRequestSendComponent implements OnInit {
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public userList: any[] = [];
  public userDetails: any;
  public userFriends;
  public sentRequests;
  public receivedRequests;

  @Output() notifyToGetFriendTodo = new EventEmitter();
  @Input() hideFriendsInSingleUser = "multi-user";

  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService
  ) {
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.getAllUsersToSendFriendRequest();
    this.socketService.notify(this.userId).subscribe(data => {
      this.getAllUsersToSendFriendRequest();
    });
     this.verifyUserConfirmation();
  }


  //Function to get all users
  getAllUsersToSendFriendRequest() {
    let getSingleUserDetails = () => {
      return new Promise((resolve, reject) => {
        if (this.authToken != null && this.userId != null) {
          this.appService.getUserDetails(this.userId, this.authToken).subscribe(
            apiResponse => {
              if (apiResponse.status == 200) {
                this.userDetails = apiResponse.data;
                this.appService.setUserInfoInLocalStorage(this.userDetails);
                resolve(this.userDetails);
              }
            },
            error => {
              if (error.status == 400) {
                this.toastr.warning("User Details not found", "Error!");
                reject("User Details not found");
              } else {
                this.toastr.error("Some Error Occurred", "Error!");
                this.router.navigate(["/serverError"]);
              }
            } //end error
          ); //end appservice.getuserdetails
        } //end if checking undefined
        else {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(["/user/login"]);
        }
      });
    };
    let getAllUsersExist = userDetails => {
      return new Promise((resolve, reject) => {
        if (this.authToken != null) {
          this.appService.getAllUsers(this.authToken).subscribe(
            apiResponse => {
              if (apiResponse.status == 200) {
                this.userList = apiResponse["data"];
                this.userList = this.userList.filter(
                  user => user.userId != this.userId
                ); //excluding myself from this array so that i cant send friend request to me

                this.userFriends = userDetails.friends;
                this.sentRequests = userDetails.friendRequestSent;
                this.receivedRequests = userDetails.friendRequestReceived;

                for (let user of this.userList) {
                  for (let friend of this.userFriends) {
                    if (user.userId == friend.friendId) {
                      user.isFriend = true;
                    }
                  }
                }

                /* Removing user from all users list if he is is in the list of sent requests*/
                for (let user of this.userList) {
                  for (let friendSent of this.sentRequests) {
                    if (user.userId == friendSent.friendId) {
                      this.userList = this.userList.filter(
                        user => user.userId != friendSent.friendId
                      );
                    }
                  }
                }

                /* Remove user from all users list if he is is in the list of requests received*/
                for (let user of this.userList) {
                  for (let friendReceived of this.receivedRequests) {
                    if (user.userId == friendReceived.friendId) {
                      this.userList = this.userList.filter(
                        user => user.userId != friendReceived.friendId
                      );
                    }
                  }
                }

                resolve(this.userList);
              }
            },
            error => {
              if (error.status == 400) {
                this.toastr.warning("User List falied to Update", "Error!");
                reject("User List falied to Update");
              } else {
                this.toastr.error("Some Error Occurred", "Error!");
                this.router.navigate(["/serverError"]);
              }
            }
          );
        } else {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(["/user/login"]);
        }
      });
    };

    getSingleUserDetails()
      .then(getAllUsersExist)
      .then(resolve => {
        // console.log(resolve);
      })
      .catch(err => {
        console.log(err);
      });
  }


  //Function to accept friend request and send notifications to respective users
  sendFriendRequest(receiver) {
    const friendRequest = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: receiver.userId,
      receiverName: receiver.firstName + " " + receiver.lastName,
      authToken: this.authToken
    };
    this.appService.sendFriendRequest(friendRequest).subscribe(apiResponse => {
      if ((apiResponse.status = 200)) {
        let senderNotifyObj = {
          receiverName: this.userName,
          receiverId: this.userId,
          senderId: receiver.userId,
          senderName: receiver.firstName + " " + receiver.lastName,
          redirectId: "friend",
          message: `You have sent a friend Request to ${friendRequest.receiverName}`,
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
          receiverId: receiver.userId,
          receiverName: receiver.firstName + " " + receiver.lastName,
          redirectId: "friend",
          message: `You have received a friend request from ${friendRequest.senderName}`,
          authToken: this.authToken
        };
        this.appService
          .saveUserNotification(ReceiverNotifyObj)
          .subscribe(apiResponse => {
            if (apiResponse.status == 200) {
              this.socketService.sendNotify(ReceiverNotifyObj);
            }
          });
        this.getAllUsersToSendFriendRequest();
      }
    });
  }


  //Function to unfriend user and to send notifications to respective users
  unFriend(friend) {
    const unfriendOption = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: friend.friendId,
      receiverName: friend.friendName,
      authToken: this.authToken
    };
    this.appService.unFriendRequest(unfriendOption).subscribe(apiResponse => {
      if ((apiResponse.status = 200)) {
        let senderNotifyObj = {
          receiverName: this.userName,
          receiverId: this.userId,
          senderName: friend.friendName,
          senderId: friend.friendId,
          redirectId: "friend",
          message: `You and ${unfriendOption.senderName} are not friends anymore`,
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
          message: `You and ${unfriendOption.senderName} are not friends anymore`,
          authToken: this.authToken
        };
        this.appService
          .saveUserNotification(ReceiverNotifyObj)
          .subscribe(apiResponse => {
            if (apiResponse.status == 200) {
              this.socketService.sendNotify(ReceiverNotifyObj);
            }
          });

        this.getAllUsersToSendFriendRequest();
      }
    });
  }

  //Function to notify whether we are in friend mode
  getFriendList(friendId) {
    this.notifyToGetFriendTodo.emit({ getTodo: true, friendId: friendId });
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
