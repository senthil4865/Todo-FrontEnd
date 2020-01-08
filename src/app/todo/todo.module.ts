import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../shared/shared.module";

import { TodoRoutingModule } from "./todo-routing.module";
import { SingleUserComponent } from "./single-user/single-user.component";
import { MultiUserComponent } from "./multi-user/multi-user.component";

/* Module for Toaster */
import { ToastrModule } from "ngx-toastr";

import {
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSidenavModule,
  MatMenuModule,
  MatListModule,
  MatDialogModule,
  MatTabsModule,
  MatCardModule,
  MatPaginatorModule
} from "@angular/material";

import { FriendsComponent } from "./friends/friends.component";
import { FriendRequestSendComponent } from "./friend-request-send/friend-request-send.component";
import { FriendRequestReceivedComponent } from "./friend-request-received/friend-request-received.component";
import { FriendRequestSentComponent } from "./friend-request-sent/friend-request-sent.component";
import { TodoDescriptionComponent } from "./todo-description/todo-description.component";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: "toast-top-right",
      preventDuplicates: true
    }),

    TodoRoutingModule
  ],

  entryComponents: [],
  declarations: [
    SingleUserComponent,
    MultiUserComponent,
    FriendRequestSendComponent,
    FriendRequestReceivedComponent,
    FriendRequestSentComponent,
    FriendsComponent,
    TodoDescriptionComponent
  ]
})
export class TodoModule {}
