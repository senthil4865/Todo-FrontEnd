import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import * as io from "socket.io-client";
import { AppService } from "../../app.service";
import { ToastrService } from "ngx-toastr";
import { Cookie } from "ng2-cookies/ng2-cookies";

import { SocketService } from "../../socket.service";
import { PageEvent } from "@angular/material";
import { Location } from "@angular/common";

@Component({
  selector: "app-todo-description",
  templateUrl: "./todo-description.component.html",
  styleUrls: ["./todo-description.component.css"],
  providers: [SocketService]
})
export class TodoDescriptionComponent {
  /* User Details */
  socket;
  public userId: string;
  public userName: string;
  public userInfo: any;
  public authToken: string;
  public allLists: any = [];
  public idofTodo: string;
  public todoforDescription: any;
  public friendDescription:boolean=false;
 
  constructor(
    public appService: AppService,
    public toastr: ToastrService,
    public router: Router,
    public socketService: SocketService,
    private location: Location
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.idofTodo = event.url.split("/")[3];
        if (this.idofTodo) {
          this.getTodoDescription(this.idofTodo);
          this.friendDescription=false;
        }
        if(this.idofTodo==='friend'){
        this.friendDescription=true;
        }
       else  if(this.idofTodo==='undefined'){
          this.friendDescription=true;
          }
          else if(this.idofTodo==''){
            this.friendDescription=true;
          }
      }
    });
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("userId");
    this.userName = Cookie.get("userName");
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
  }

  getTodoDescription(id) {
    this.appService.getTodoDetail(id).subscribe(data => {
      this.todoforDescription = data[0];
    });
  }

  public goBack() {
    this.location.back();
  }
}
