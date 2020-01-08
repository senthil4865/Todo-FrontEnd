import { NgModule } from "@angular/core";

import { Routes, RouterModule } from "@angular/router";
import { SingleUserComponent } from "./single-user/single-user.component";
import { MultiUserComponent } from "./multi-user/multi-user.component";
import { FriendsComponent } from "./friends/friends.component";
import { TodoDescriptionComponent } from "./todo-description/todo-description.component";

const routes: Routes = [
  { path: "single-user", component: SingleUserComponent },
  { path: "multi-user", component: MultiUserComponent },
  { path: "manage-friends", component: FriendsComponent },
  { path: "todo-description/:id", component: TodoDescriptionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodoRoutingModule {}
