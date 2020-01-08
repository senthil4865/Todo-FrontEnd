import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener
} from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";

// import { SocketService } from "../../socket.service";
import { MatDialog, PageEvent } from "@angular/material";
import { DialogBoxComponent } from "src/app/shared/dialog-box/dialog-box.component";
import { SocketService } from "./../../socket.service";

@Component({
  selector: "app-multi-user",
  templateUrl: "./multi-user.component.html",
  styleUrls: ["./multi-user.component.css"]
  // providers: [SocketService]
})
export class MultiUserComponent {
  @ViewChild("friend") friend: ElementRef<HTMLElement>;
  events: string[] = [];
  opened: boolean;
  friendMode: boolean = false; //to prevent friend to add a todo
  currentView: string = "single-user";
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public length: number;
  public listName: string;
  public currentListIdForTodo: any;
  public currentListId: any;
  public upatelistName: any;
  public allLists:any=[];
  public upateTodoName: any;
  public subTodoName;
  public descriptionUrl;
  public todoNameEntered: any;
  public List: any[] = [];
  public completedCount: any = 0;
  toDoList: any[] = [];
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public friendListId:any='';
  pageIndex: number = 0;
  progressSpinner: boolean = false;
  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public dialog: MatDialog,
    public socketService: SocketService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentView = event.url.split("/")[2];
      }
    });
  }

  //Dialog Box for sub task
  openDialog(todoId): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: { title: "Enter Sub Task Name", value: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.subTodoName = result;
      this.addSubTodo(result, todoId);
    });
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.getAllListByUser(this.userId); //Initially get all the lists by current user
    this.getAllTodo(this.pageSize, this.pageIndex);
    this.getUpdatesFromUser();
    this.verifyUserConfirmation();
  }

  //Listening to page change event and get data according to it
  public getServerData(event?: PageEvent) {
    this.getAllTodo(event.pageSize, event.pageIndex);

    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  //FFunction to create a List and send notification
  createList() {

    if (this.listName) {
      this.progressSpinner = true;
      const data = {
        listName: this.listName,
        listCreatedBy: this.userId,
        listModifiedBy: this.userId,
        authToken: Cookie.get("authToken")
      };
      this.listName = "";
      if (this.userId != null && this.authToken != null) {
        this.appService.addList(data).subscribe(
          apiResponse => {
            if (apiResponse.status == 200) {
              if (this.currentView == "multi-user")
                this.notify(
                  `${this.userName} has Created a List With Name ${data.listName}`
                );
             this.toastr.success("List Created","Success");
              this.getAllListByUser(this.userId);
              this.getAllTodo(this.pageSize, this.pageIndex);
            } else {
              this.toastr.info(apiResponse.message, "Update!");
              this.progressSpinner=false;
            }
          },
          error => {
            this.progressSpinner=false;
            if (error.status == 400) {
              this.toastr.warning(
                "Lists Failed to Update",
                "Either user or List not found"
              );
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
    }
  }

  getAllListByUser(userId) {
    if(userId && !this.friendMode){
      this.progressSpinner=true;
      this.appService.getAllList(userId).subscribe(apiResponse => {
        console.log(apiResponse,'get all list');
        if (apiResponse.message == "Invalid Or Expired AuthorizationKey") {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(["/user/login"]);
          this.progressSpinner=false;
        }
        if (apiResponse.status == 200) {
          this.List = [];
          apiResponse = apiResponse.data;
          apiResponse.forEach(list => {
            this.List.push(list);
          });
          this.progressSpinner=false;
        }else{
          this.List = [];
          this.toastr.info('No List Found','Info');
          this.progressSpinner=false;
        }
      });
    }
     if(this.friendMode){
      if(this.friendListId){
        this.progressSpinner=true;
        this.appService.getAllList(this.friendListId).subscribe(apiResponse => {
          console.log(apiResponse,'get all list');
          if (apiResponse.message == "Invalid Or Expired AuthorizationKey") {
            this.toastr.info("Missing Authorization Key", "Please login again");
            this.router.navigate(["/user/login"]);
            this.progressSpinner=false;
          }
          if (apiResponse.status == 200) {
            this.List = [];
            apiResponse = apiResponse.data;
            apiResponse.forEach(list => {
              this.List.push(list);
            });
            this.progressSpinner=false;
          }else{
            this.List = [];
            this.toastr.info('No List Found','Info');
            this.progressSpinner=false;
          }
        });
      }
    }


  }

  addTodoUnderList(id, ListId) {
    this.currentListIdForTodo = id;
    this.currentListId = ListId;
    this.getAllTodo(this.pageSize, this.pageIndex);
  }

  addSubTodo(subtodoName, ParentTodoId) {
   
    if (subtodoName && ParentTodoId) {
      this.progressSpinner = true;
      const data = {
        ownerTodo: ParentTodoId,
        subTodoName: subtodoName,
        subtodoCreatedBy: this.userId,
        subtodoModifiedBy: this.userId
      };

      if (this.userId != null && this.authToken != null) {
        this.appService.addSubTodo(data).subscribe(
          apiResponse => {
            if (apiResponse.status == 200) {
              this.toastr.success("Sub Todo Added","Success"); 
              if (this.currentView == "multi-user")
                this.notify(
                  `${this.userName} has Added a Sub Todo With Name ${subtodoName}`
                );
              //For undo action
              let undoAction: any = {
                listId: this.currentListIdForTodo,
                subTodoId: apiResponse.data.subTodoId,
                action: "Sub Todo Add",
                authToken: this.authToken
              };
              this.addToUndoFunction(undoAction);
              this.getAllTodo(this.pageSize, this.pageIndex);
            } else {
                this.progressSpinner=false;
              this.toastr.info(apiResponse.message, "Update!");
            }
          },
          error => {
            this.progressSpinner=false;
            if (error.status == 400) {
              this.toastr.warning(
                "Lists Failed to Update",
                "Either user or List not found"
              );
            } else {
              this.toastr.error("Some Error Occurred", "Error!");
              this.router.navigate(["/serverError"]);
            }
          }
        );
      } else {
        this.progressSpinner=false;
        this.toastr.info("Missing Authorization Key", "Please login again");
        this.router.navigate(["/user/login"]);
      }
    }
  }

  addToDo(value) {
      this.todoNameEntered = "";
      if (value && this.currentListIdForTodo) {
        this.progressSpinner = true;
        const data = {
          ownerList: this.currentListIdForTodo,
          todoName: value,
          todoDescription: value,
          todoCreatedBy: this.userId,
          todoModifiedBy: this.userId
        };
        if (this.userId != null && this.authToken != null) {
          this.appService.addTodo(data).subscribe(
            apiResponse => {
              if (apiResponse.status == 200) {
                this.toastr.success("Todo Added","Success"); 
                //For undo action
                let undoAction: any = {
                  listId: this.currentListIdForTodo,
                  todoId: apiResponse.data.todoId,
                  action: "Todo Add",
                  authToken: this.authToken
                };
                this.addToUndoFunction(undoAction);
              
                this.getAllTodo(this.pageSize, this.pageIndex);
              
                this.descriptionUrl = apiResponse.data.todoId;
                if (this.currentView == "multi-user")
                  this.notify(
                    `${this.userName} added Task ${apiResponse.data.todoName}`
                  );
              } else {
                this.toastr.info(apiResponse.message, "Update!");
                this.allLists.length=0;
                this.progressSpinner=false;
              }
            },
            error => {
              this.progressSpinner=false;
              if (error.status == 400) {
                this.toastr.warning(
                  "Failed to Add Todo",
                  "Either user or List not found"
                );
                  this.allLists.length=0;
              } else {
                this.progressSpinner=false;
                this.toastr.error("Some Error Occurred", "Error!");
                this.router.navigate(["/serverError"]);
              }
            }
          );
        } else {
          this.progressSpinner=false;
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(["/user/login"]);
        }
      }
  }

  getAllTodo(pageSize, pageIndex, fromUndo?: any) {
   
    if (this.currentListIdForTodo){
      this.progressSpinner=true;
      this.appService
      .getAllTodos(pageSize, pageIndex, this.currentListIdForTodo)
      .subscribe(apiResponse => {
        if (apiResponse.message == "Invalid Or Expired AuthorizationKey") {
          this.toastr.info("Missing Authorization Key", "Please login again");
          this.router.navigate(["/user/login"]);
          this.progressSpinner=false;
        }
        
          if(apiResponse.status=200){
            this.toDoList = [];
            this.length = apiResponse["count"];
            this.completedCount = 0;
            if (apiResponse["data"])
              apiResponse["data"].forEach(todo => {
                //Add to todo array
                this.toDoList.push(todo);
                //Keeping track of completed count of main todo items
                if (todo.completed == true) {
                  this.completedCount = this.completedCount + 1;
                }
              });
             
                this.progressSpinner=false;
          }
          else{
            this.toastr.info(apiResponse.message, "Update!");
            this.progressSpinner=false;
          }
    
        // if(!fromUndo){
        //   this.checkMainTodoStatusUpdate();
        //   this.MakeAllSubTodoChecked();
        // }
      });
    }     
  }

  getFriendList($event) {
    if ($event.getTodo) {
      if ($event.friendId) {
        this.friendListId=$event.friendId;
        this.progressSpinner = true;
        this.appService
          .getAllFriendsList($event.friendId)
          .subscribe(apiResponse => {
            if ((apiResponse.status = 200)) {
              this.toastr.success("Friend Lists Fetched","Success"); 
              this.List = [];
              this.friendMode = true;
              this.List = apiResponse.data;
              this.progressSpinner=false;
            }else{
              this.toastr.info('Cant Find Friend List','Update');
              this.progressSpinner=false;
            }
          });
      }
    }
  }

  //making friend mode off and getting current logged in user lists
  friendModeOff() {
    this.friendMode = false;
    this.friendListId='';
    this.toDoList = []; //clean up the todo list
    this.getAllListByUser(this.userId);
  }

  showOptions(checkedState, todoId, fromUndo?: any) {
    
    //For undo action
    let undoAction: any = {
      listId: this.currentListIdForTodo,
      todoId: todoId,
      action: "Todo Update",
      authToken: this.authToken
    };
    
    if(todoId && checkedState){
      this.addToUndoFunction(undoAction);
    }
    if (todoId) {
      this.progressSpinner = true;
     
      this.appService.changeCompleteState(checkedState, todoId).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success("Complete state Updated", "Success");
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex, fromUndo);
            this.notify(
              `${this.userName} has updated a Complete state for a Todo`
            );
            this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning("Failed to Update Todo", "Unknown error occured");
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }

  showSubOptions(checkedState, subTodoId, fromUndo?: any) {
    this.progressSpinner = true;
    //For undo action
    let undoAction: any = {
      listId: this.currentListIdForTodo,
      subTodoId: subTodoId,
      action: "Sub Todo Update",
      authToken: this.authToken
    };
if(subTodoId && checkedState) {
  this.addToUndoFunction(undoAction);
}
    if (subTodoId ){
      this.appService
      .changeCompleteStateSubTodo(checkedState, subTodoId)
      .subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success("Complete state Updated", "Success");
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex, fromUndo);
            this.notify(
              `${this.userName} has updated a Complete state for a Sub Todo`
            );
            this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Update Todo",
              "Unknown error occured"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );

    } 
  
  }

  updateList(listId) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: { title: "Enter List Name to Update With", value: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.upatelistName = result;
      if (result) this.updateTodoList(result, listId);
    });
  }

  updateTodo(todoId) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: { title: "Enter Task Name to update with", value: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.upateTodoName = result;
      if (result) this.updateTodoTask(result, todoId);
    });
  }

  public updateTodoTask(name, todoId): any {
   
    if (!name) {
      this.toastr.warning("Todo Name is required", "Warning!");
    } else {
      this.progressSpinner = true;
      let data = {
        todoId: todoId,
        TodoName: name,
        TodoModifiedBy: this.userId,
        authToken: this.authToken
      };

      //For undo action
      let undoAction: any = {
        listId: this.currentListIdForTodo,
        todoId: todoId,
        action: "Todo Update",
        authToken: this.authToken
      };
      this.addToUndoFunction(undoAction);
      this.appService.updateTodo(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success("Todo Name Updated", "Success");
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.descriptionUrl = data.todoId;
            if (this.currentView == "multi-user")
              this.notify(
                `${this.userName} has updated a Todo with Name ${name}`
              );
              this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Update Todo",
              "One or more fields are missing"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }

  updatesubTodo(subtodoId) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: "250px",
      data: { title: "Enter sub Task Name to update with", value: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.upateTodoName = result;
      if (result) this.updatesubTodoTask(result, subtodoId);
    });
  }

  public updatesubTodoTask(name, subtodoId): any {
  
    if (!name) {
      this.toastr.warning("sub Todo Name is required", "Warning!");
    } else {
      this.progressSpinner = true;
      let data = {
        subTodoId: subtodoId,
        subTodoName: name,
        subTodoModifiedBy: this.userId,
        authToken: this.authToken
      };

      //For undo action
      let undoAction: any = {
        listId: this.currentListIdForTodo,
        subTodoId: subtodoId,
        action: "Sub Todo Update",
        authToken: this.authToken
      };
      this.addToUndoFunction(undoAction);
      this.appService.updatesubTodo(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success("Sub Todo Name Updated", "Success");
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            if (this.currentView == "multi-user")
              this.notify(
                `${this.userName} has updated a Sub Todo name ${name}`
              );
              this.progressSpinner=false;
          } else {
            this.progressSpinner=false;
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Update Todo",
              "One or more fields are missing"
            );
          } else {
            
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }

  public updateTodoList(name, ListId): any {
 
    if (!name) {
      this.toastr.warning("List Name is required", "Warning!");
    } else {
      this.progressSpinner=true;
      let data = {
        ListId: ListId,
        ListName: name,
        ListModifiedBy: this.userId,
        authToken: this.authToken
      };
      this.appService.updateList(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.toastr.success("List Name Updated", "Success");
            this.getAllListByUser(this.userId);
            if (this.currentView == "multi-user")
              this.notify(
                `${this.userName} has updated a list name ${apiResponse.data.ListName}`
              );
              this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Update List",
              "One or more fields are missing"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }
  //Function to Delete todo and subtodo recursively
  public deleteTodo(todoId, todoName?: any, fromUndo?: any): any {
 
    let optionforTodoDelete = {
      todoId: todoId,
      authToken: this.authToken
    };

    //For undo action
    let undoAction: any = {
      listId: this.currentListIdForTodo,
      todoId: todoId,
      action: "Todo Delete",
      authToken: this.authToken
    };
    if (!fromUndo){
      this.addToUndoFunction(undoAction);
    }

    if (todoId) {
      this.progressSpinner=true;
      this.appService.deleteAllTodosById(optionforTodoDelete).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            if (this.currentView == "multi-user" && !fromUndo)
              this.notify(
                `${this.userName} has Deleted a Todo `
              );
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.toastr.success("Todo Deleted", "Success");
            this.progressSpinner=false;
          } else {
            this.progressSpinner=false;
            this.toastr.error(apiResponse.message, "Error!");
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Delete List",
              "One or more fields are missing"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }

  //Function to Delete  subtodo
  public deleteSubTodo(subTodoId, subTodoName?: any, fromUndo?: any): any {
  
    let optionforsubTodoDelete = {
      subTodoId: subTodoId,
      authToken: this.authToken
    };

    let undoAction: any = {
      listId: this.currentListIdForTodo,
      subTodoId: subTodoId,
      action: "Sub Todo Delete",
      authToken: this.authToken
    };
    if (subTodoId && !fromUndo){
      this.addToUndoFunction(undoAction);
    } 

    if (subTodoId) {
      this.progressSpinner=true;
      this.appService.deletesubTodo(optionforsubTodoDelete).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            //For undo action
            if (this.currentView == "multi-user" && !fromUndo)
              this.notify(
                `${this.userName} has Deleted a Sub Todo with Name ${subTodoName}`
              );
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.toastr.success("Sub Todo Deleted", "Success");
            this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Delete subTodo",
              "One or more fields are missing"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
  }

  public deleteTodoList(listId, listName?: any): any {
   
    let dataforSubTodoDelete;
    //options for both todo and list deletion
     if(listId){
      let optionforSubTodoDelete = {
        ListId: listId,
        authToken: this.authToken
      };
      this.progressSpinner=true;
      //Getting all todos under a list to delete todos and subtodos recursively
      this.appService
        .getAllTodosByListId(optionforSubTodoDelete)
        .subscribe(apiResponse => {
          dataforSubTodoDelete = apiResponse.data;
  
          //Delete todo and subtodo recursively
          dataforSubTodoDelete.filter(todo => {
            this.deleteTodo(todo.todoId);
          });
        });
  
      //After Todos and sub todo is deleted,actual list should be deleted
      this.appService.deleteList(optionforSubTodoDelete).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            if (this.currentView == "multi-user")
              this.notify(
                `${this.userName} has Deleted a List With Name ${listName}`
              );
            this.getAllListByUser(this.userId);
            this.toastr.success("List Deleted", "Success");
            this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Delete List",
              "One or more fields are missing"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
     }
  }

  public notify(message) {
    //sending notification to friendss
    this.userInfo.friends.filter(friend => {
      let notifyObj = {
        senderName: this.userName,
        senderId: this.userId,
        receiverName: friend.friendName,
        receiverId: friend.friendId,
        redirectId: this.descriptionUrl,
        message: message,
        authToken: this.authToken
      };
      this.appService.saveUserNotification(notifyObj).subscribe(apiResponse => {
        this.socketService.sendNotify(notifyObj);
      });
      this.descriptionUrl = "";
    });
  }

  public updateTodoTaskForUndoOperation(data) {
    if (data)
    this.progressSpinner=true;
      this.appService.updateTodoTaskForUndo(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.toastr.success("Todo updated", "Success");
            this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Update todo list",
              "One or more fields are missing"
            );
          } else {
            this.progressSpinner=false;
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
  }

  public updatesubTodoTaskForUndoOperation(data) {
    if (data){
      this.progressSpinner=true;
      this.appService.updatesubTodoTaskForUndo(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.toastr.success("sub Todo updated", "Success");
            this.progressSpinner=false;
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Update sub todo",
              "One or more fields are missing"
            );
          } else {
            this.progressSpinner=false;
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }

  }

  public addTodoTaskForUndoOperation(data) {
    if (data){
      this.progressSpinner=true;
      this.appService.addTodoTaskForUndo(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            if (data.subtodo) {
              data.subtodo.forEach(subtodo => {
                this.addsubTodoTaskForUndoOperation(subtodo);
              });
            }

            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.toastr.success("Todo Added", "Success");
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Add todo",
              "One or more fields are missing"
            );
          } else {
            this.progressSpinner=false;
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );

    }
    
  }

  public addsubTodoTaskForUndoOperation(data) {
    if (data){
      this.progressSpinner=true;
      this.appService.addsubTodoTaskForUndo(data).subscribe(
        apiResponse => {
          if (apiResponse.status == 200) {
            this.getAllListByUser(this.userId);
            this.getAllTodo(this.pageSize, this.pageIndex);
            this.toastr.success("sub Todo Added", "Success");
          } else {
            this.toastr.error(apiResponse.message, "Error!");
            this.progressSpinner=false;
          }
        },
        error => {
          this.progressSpinner=false;
          if (error.status == 400) {
            this.toastr.warning(
              "Failed to Add sub todo",
              "One or more fields are missing"
            );
          } else {
            this.toastr.error("Some Error Occurred", "Error!");
            this.router.navigate(["/serverError"]);
          }
        }
      );
    }
 
  }

  public verifyUserConfirmation: any = () => {
    this.socketService.verifyUser().subscribe(
      () => {
        this.socketService.setUser(this.authToken); //in reply to verify user emitting set-user event with authToken as parameter.
      },
      err => {
        this.toastr.error(err, "Some error occured");
      }
    ); //end subscribe
  };

  public getUpdatesFromUser = () => {
    this.socketService.getUpdatesFromUser(this.userId).subscribe(data => {
    });
  };

  ngOnDestroy() {
    this.socketService.exitSocket();
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (
      (event.ctrlKey && event.key == "z") ||
      (event.metaKey && event.key == "z")
    ) {
      if (this.currentListIdForTodo) {
        let data = {
          listId: this.currentListIdForTodo,
          authToken: this.authToken
        };
        this.undoFunction(data);
      }
    }
  }

  undoHandlerButton() {
    if (this.currentListIdForTodo) {
      let data = {
        listId: this.currentListIdForTodo,
        authToken: this.authToken
      };
      this.undoFunction(data);
    }
  }

  public undoFunction(data): any {
    this.appService.getUndo(data).subscribe(apiResponse => {
      if (apiResponse.status == 200) {
        if (apiResponse.data.action == "Todo Add") {
          this.deleteTodo(apiResponse.data.todoId, null, true);
        } else if (apiResponse.data.action == "Todo Delete") {
          this.addTodoTaskForUndoOperation(apiResponse.data.todoValues[0]);
        } else if (apiResponse.data.action == "Todo Update") {
          this.updateTodoTaskForUndoOperation(apiResponse.data.todoValues[0]);
        } else if (apiResponse.data.action == "Sub Todo Add") {
          this.deleteSubTodo(apiResponse.data.subTodoId, null, true);
        } else if (apiResponse.data.action == "Sub Todo Delete") {
          this.addsubTodoTaskForUndoOperation(apiResponse.data.todoValues[0]);
        } else if (apiResponse.data.action == "Sub Todo Update") {
          this.updatesubTodoTaskForUndoOperation(
            apiResponse.data.subTodoValues[0]
          );
        }
      } else if (apiResponse.status == 404) {
        this.toastr.info("No more undos found", "Undo Update!");
      }
    });
  }

  public addToUndoFunction(data): any {
    this.appService.addUndoDetails(data).subscribe(apiResponse => {
      if (apiResponse.status == 200) {
      }
    });
  }
}

//Further future enhancements
// // //If all subtodos are completed then main todo will be checked
// checkMainTodoStatusUpdate(){
//   this.toDoList.filter(todo => {
//     //Parent todo should be checked if all sub todos are completed
//     console.log(todo,'if')
//     if (todo.subtodo.length != 0) {
//       let length = todo.subtodo.length;
//       let subTodoCompletedCount = 0;
//       todo.subtodo.forEach(subtodo => {
//         if (subtodo.completed == true) {
//           subTodoCompletedCount += 1;
//         }
//       });
//       if (subTodoCompletedCount == length && todo.completed!=true) {
//         this.showOptions(true, todo.todoId,true);
//       }
//     }
//   });
// }

// //Mark All subtodo checked if a parent todo is checked
// MakeAllSubTodoChecked(){
//   this.toDoList.filter(todo => {
//     //Parent todo should be checked if all sub todos are completed
//     console.log(todo,'if')
//     if (todo.completed==true) {
//       todo.subtodo.forEach(subtodo => {
//         if(subtodo.completed!=true)
//         this.showSubOptions(true, subtodo.subTodoId,true);
//       });
//     }
//   });
// }

//In show sub options
//  //In case of parent and all child are checked,then unchecking even one child should uncheck parent
//  if(!fromUndo){
//   this.toDoList.filter((todos)=>{
//     let length=todos.subtodo.length;
//     let count=0;
//     if(todos.subtodo.length!=0){
//      todos.subtodo.filter((subtodos)=>{
//        if(subtodos.completed==true){
//         count+=1;
//        }
//     });
//     if(count==length){
//       this.showOptions(false, todos.todoId,true);
//     }
//     }
//   });
//  }

//In show options

// if(!fromUndo){

//     //when the parent is unchecked all the sub todos should be unchecked
//     this.toDoList.filter((todos)=>{

//       if(todos.todoId==todoId  &&   todos.completed==true ){
//         todos.subtodo.forEach(subtodo => {
//           if(subtodo.completed==true)
//           this.showSubOptions(false, subtodo.subTodoId,true);
//         });
//       }

//      });
// }
