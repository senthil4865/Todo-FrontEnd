import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import * as io from "socket.io-client";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";

import { SocketService } from "../../socket.service";
import { PageEvent } from "@angular/material";

@Component({
  selector: "app-single-user",
  templateUrl: "./single-user.component.html",
  styleUrls: ["./single-user.component.css"],
  providers: [SocketService]
})
export class SingleUserComponent {
  // /* User Details */
  // socket;
  // public userId: string;
  // public userName: string;
  // public userInfo: any;
  // public authToken: string;
  // public allLists: any = [];
  // public currentListIdForTodo: any;
  // public listName: string;
  // public List: any[] = [];
  // // public baseUrl = "http://127.0.0.1:3000";
  // toDoList = ["Clean House", "Good House"];

  // public pageSize: number = 10;
  // public pageSizeOptions: number[] = [5, 10, 25, 100];
  // pageIndex: number = 0;
  // public length: number;

  constructor(
    // public appService: AppService,
    // public toastr: ToastrService,
    // public router: Router,
    // public socketService: SocketService
  ) {
    // this.socket=io(this.baseUrl);
  }

  ngOnInit() {
    // this.authToken = Cookie.get("authToken");
    // this.userId = Cookie.get("userId");
    // this.userName = Cookie.get("userName");
    // this.getAllListByUser(this.userId); //Initially get all the lists by current user
    // this.userInfo = this.appService.getUserInfoFromLocalStorage();
    // this.getAllTodo(this.pageSize, this.pageIndex);
    // this.getUpdatesFromUser();
    // this.verifyUserConfirmation();
  }

  // createList() {
  //   if (this.listName) {
  //     const data = {
  //       listName: this.listName,
  //       listCreatedBy: this.userId,
  //       listModifiedBy: this.userId,
  //       authToken: Cookie.get("authToken")
  //     };
  //     this.listName = "";
  //     if (this.userId != null && this.authToken != null) {
  //       this.appService.addList(data).subscribe(
  //         apiResponse => {
  //           if (apiResponse.status == 200) {
  //             console.log(apiResponse.data, "List");
  //             this.getAllListByUser(this.userId);
  //             this.getAllTodo(this.pageSize, this.pageIndex);
  //           } else {
  //             this.toastr.info(apiResponse.message, "Update!");
  //             // this.allLists.length = 0;
  //           }
  //         },
  //         error => {
  //           if (error.status == 400) {
  //             this.toastr.warning(
  //               "Lists Failed to Update",
  //               "Either user or List not found"
  //             );
  //             // this.allLists.length = 0;
  //           } else {
  //             this.toastr.error("Some Error Occurred", "Error!");
  //             this.router.navigate(["/serverError"]);
  //           }
  //         } //end error
  //       ); //end appservice.getAllLists
  //     } else {
  //       this.toastr.info("Missing Authorization Key", "Please login again");
  //       this.router.navigate(["/user/login"]);
  //     }
  //   }
  // }

  // getAllListByUser(userId) {
  //   this.appService.getAllList(userId).subscribe(apiResponse => {
  //     this.List = [];
  //     apiResponse = apiResponse.data;
  //     apiResponse.forEach(list => {
  //       this.List.push(list);
  //     });
  //     console.log(this.List, "List by current user");
  //   });
  // }

  // public getServerData(event?: PageEvent) {
  //   this.getAllTodo(event.pageSize, event.pageIndex);

  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  // }

  // addTodoUnderList(id) {
  //   this.currentListIdForTodo = id;
  //   this.getAllTodo(this.pageSize, this.pageIndex);
  // }

  // addToDo(value) {
  //   if (value && this.currentListIdForTodo) {
  //     console.log("happened");
  //     const data = {
  //       ownerList: this.currentListIdForTodo,
  //       todoName: value,
  //       todoDescription: value,
  //       todoCreatedBy: this.userId,
  //       todoModifiedBy: this.userId
  //     };
  //     if (this.userId != null && this.authToken != null) {
  //       this.appService.addTodo(data).subscribe(
  //         apiResponse => {
  //           if (apiResponse.status == 200) {
  //             console.log(apiResponse.data);
  //             this.getAllTodo(this.pageSize, this.pageIndex);
  //             // this.allLists = apiResponse.data;
  //             //this.toastr.info("Lists Updated", `Lists Found!`);
  //             //console.log(this.allLists)
  //           } else {
  //             this.toastr.info(apiResponse.message, "Update!");
  //             this.allLists.length = 0;
  //           }
  //         },
  //         error => {
  //           if (error.status == 400) {
  //             this.toastr.warning(
  //               "Lists Failed to Update",
  //               "Either user or List not found"
  //             );
  //             this.allLists.length = 0;
  //           } else {
  //             this.toastr.error("Some Error Occurred", "Error!");
  //             this.router.navigate(["/serverError"]);
  //           }
  //         } //end error
  //       ); //end appservice.getAllLists
  //     } else {
  //       this.toastr.info("Missing Authorization Key", "Please login again");
  //       this.router.navigate(["/user/login"]);
  //     }
  //   }
  // }

  // getAllTodo(pageSize, pageIndex) {
  //   if (this.currentListIdForTodo)
  //     this.appService
  //       .getAllTodos(pageSize, pageIndex, this.currentListIdForTodo)
  //       .subscribe(todos => {
  //         console.log(todos, "todos");
  //         this.toDoList = [];
  //         this.length = todos["count"];
  //         todos["data"].forEach(todo => {
  //           console.log(todo);
  //           if (!this.toDoList.includes(todo.todoName)) {
  //             this.toDoList.push(todo.todoName);
  //           }
  //         });
  //       });
  // }

  // public getUpdatesFromUser = () => {
  //   this.socketService.getUpdatesFromUser(this.userId).subscribe(data => {
  //     //getting message from user.
  //     this.toastr.info(data.message);
  //   });
  // }; //end getUpdatesFromUser

  // //listened
  // public verifyUserConfirmation: any = () => {
  //   this.socketService.verifyUser().subscribe(
  //     () => {
  //       this.socketService.setUser(this.authToken); //in reply to verify user emitting set-user event with authToken as parameter.
  //     },
  //     err => {
  //       this.toastr.error(err, "Some error occured");
  //     }
  //   ); //end subscribe
  // };

  // ngOnDestroy() {
  //   this.socketService.exitSocket();
  // }
}
