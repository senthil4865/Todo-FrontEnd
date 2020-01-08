import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies/ng2-cookies";

@Injectable({
  providedIn: "root"
})
export class AppService {
  public baseUrl = "http://localhost:3000/api/v1";

  public userFriends: any = [];

  constructor(private _http: HttpClient) {
   
  }

  public signUp(data): Observable<any> {
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("mobileNumber", data.mobileNumber)
      .set("email", data.email)
      .set("password", data.password)
      .set("countryName", data.countryName)
     
    return this._http.post(`${this.baseUrl}/users/signup`, params);
  } //end signUp

  public signIn(data): Observable<any> {
    const params = new HttpParams()
      .set("email", data.email)
      .set("password", data.password);

    return this._http.post(`${this.baseUrl}/users/login`, params);
  } //end signIn

  public getCountryNames(): Observable<any> {
    return this._http.get("./../assets/countryNames.json");
  } //end getCountryNames

  public getCountryNumbers(): Observable<any> {
    return this._http.get("./../assets/countryPhoneCodes.json");
  } //end getCountryNumbers

  public setUserInfoInLocalStorage = data => {
    localStorage.setItem("userInfo", JSON.stringify(data));
  }; //end of setlocalstorage Function

  public getUserInfoFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
  }; //end getlocalstorage function

  public verifyEmail(userId): Observable<any> {
    const params = new HttpParams().set("userId", userId);

    return this._http.put(`${this.baseUrl}/users/verifyEmail`, params);
  } //end verifyEmail

  public logout(userId, authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);

    return this._http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  }

  public addTodo(data): Observable<any> {
    const params = new HttpParams()
      .set("ownerList", data.ownerList)
      .set("todoName", data.todoName)
      .set("todoDescription", data.todoDescription)
      .set("todoCreatedBy", data.todoCreatedBy)
      .set("todoModifiedBy", data.todoModifiedBy)
    return this._http.post(`${this.baseUrl}/todo/addTodo`, params);
  }

  public addSubTodo(data): Observable<any> {
    const params = new HttpParams()
      .set("ownerTodo", data.ownerTodo)
      .set("subTodoName", data.subTodoName)
      .set("subTodoCreatedBy", data.subtodoCreatedBy)
      .set("subTodoModifiedBy", data.subtodoModifiedBy);

    return this._http.post(
      `${this.baseUrl}/todo/${data.ownerTodo}/addSubTodo`,
      params
    );
  }

  public getAllTodos(pageSize, pageIndex, id): any {
    return this._http.get(
      `${
        this.baseUrl
      }/todo/${id}/getAllTodos?pageSize=${pageSize}&pageIndex=${pageIndex}&authToken=${Cookie.get(
        "authToken"
      )}`
    );
  }

  public getAllUsers(authToken): any {
    return this._http.get(
      `${this.baseUrl}/users/view/all?authToken=${authToken}`
    );
  }
  public getAllTodosByListId(dataforSubTodoDelete): any {
    return this._http.get(
      `${this.baseUrl}/todo/${
        dataforSubTodoDelete.ListId
      }/getListById?authToken=${Cookie.get("authToken")}`
    );
  }

  public sendFriendRequest(friendRequest): any {
    const params = new HttpParams()
      .set("senderId", friendRequest.senderId)
      .set("senderName", friendRequest.senderName)
      .set("receiverId", friendRequest.receiverId)
      .set("receiverName", friendRequest.receiverName)
      .set("authToken", friendRequest.authToken);
    return this._http.post(
      `${this.baseUrl}/friends/send/friend/request`,
      params
    );
  }
  
  public rejectFriendRequest(data): Observable<any>{

    const params = new HttpParams()
      .set('senderId',data.senderId)
      .set('senderName',data.senderName)
      .set('receiverId',data.receiverId)
      .set('receiverName',data.receiverName)
      .set('authToken',data.authToken)
    
    return this._http.post(`${this.baseUrl}/friends/reject/friend/request`, params);
  }

  public getRequestsReceived(userId, authToken): any {
    return this._http.get(
      `${this.baseUrl}/friends/view/friend/request/received/${userId}?authToken=${authToken}`
    );
  }

  public getRequestsSent(userId, authToken): any {
    return this._http.get(
      `${this.baseUrl}/friends/view/friend/request/sent/${userId}?authToken=${authToken}`
    );
  }

  public cancelRequest(data): any {
    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("receiverId", data.receiverId)
      .set("receiverName", data.receiverName)
      .set("authToken", data.authToken);

    return this._http.post(
      `${this.baseUrl}/friends/cancel/friend/request`,
      params
    );
  }

  public acceptRequest(data): any {
    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("receiverId", data.receiverId)
      .set("receiverName", data.receiverName)
      .set("authToken", data.authToken);

    return this._http.post(
      `${this.baseUrl}/friends/accept/friend/request`,
      params
    );
  }

  public getUserDetails(userId, authToken): Observable<any> {
    return this._http.get(
      `${this.baseUrl}/users/${userId}/details?authToken=${authToken}`
    );
  }

  public unFriendRequest(data): any {
    const params = new HttpParams()
      .set("senderId", data.senderId)
      .set("senderName", data.senderName)
      .set("receiverId", data.receiverId)
      .set("receiverName", data.receiverName)
      .set("authToken", data.authToken);

    return this._http.post(`${this.baseUrl}/friends/unfriend/user`, params);
  }

  public getAllFriendsList(userId): any {
    return this._http.get(
      `${this.baseUrl}/lists/${userId}?authToken=${Cookie.get("authToken")}`
    );
  }

  public changeCompleteState(checkedState, todoId): any {
    const params = new HttpParams()
      .set("todoId", todoId)
      .set("checkedState", checkedState);

    return this._http.post(`${this.baseUrl}/todo/changeCompleteState`, params);
  }
  //changeCompleteStateSubTodo

  public changeCompleteStateSubTodo(checkedState, subTodoId): any {
    const params = new HttpParams()
      .set("subTodoId", subTodoId)
      .set("checkedState", checkedState);
    return this._http.post(
      `${this.baseUrl}/todo/changeCompleteStateSubTodo`,
      params
    );
  }

  public getUserNotification(id) {
    return this._http.get(
      `${this.baseUrl}/notification/${id}/notification?authToken=${Cookie.get(
        "authToken"
      )}`
    );
  }

  public saveUserNotification(data): any {
    const params = new HttpParams()
      .set("senderName", data.senderName)
      .set("senderId", data.senderId)
      .set("receiverName", data.receiverName)
      .set("receiverId", data.receiverId)
      .set("redirectId", data.redirectId)
      .set("message", data.message)
      .set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/notification/saveNotification`,
      params
    );
  }

  public getTodoDetail(id) {
    return this._http.get(
      `${this.baseUrl}/todo/${id}/todoDetails?authToken=${Cookie.get(
        "authToken"
      )}`
    );
  }

  public addList(list): any {
    const params = new HttpParams()
      .set("authToken", list.authToken)
      .set("listName", list.listName)
      .set("listCreatedBy", list.listCreatedBy)
      .set("listModifiedBy", list.listModifiedBy);
    return this._http.post(`${this.baseUrl}/lists/addList`, params);
  }

  public getAllList(userId): any {
    return this._http.get(
      `${this.baseUrl}/lists/${userId}?authToken=${Cookie.get("authToken")}`
    );
  }

  public updateList(data): any {
    const params = new HttpParams()
      .set("authToken", data.authToken)
      .set("ListName", data.ListName)
      .set("ListModifiedBy", data.ListModifiedBy);

    return this._http.post(
      `${this.baseUrl}/lists/${data.ListId}/updateList`,
      params
    );
  }

  public updateTodo(data): any {
    const params = new HttpParams()
      .set("authToken", data.authToken)
      .set("TodoName", data.TodoName)
      .set("TodoModifiedBy", data.TodoModifiedBy);

    return this._http.post(
      `${this.baseUrl}/todo/${data.todoId}/updateTodo`,
      params
    );
  }

  public updatesubTodo(data): any {
    const params = new HttpParams()
      .set("authToken", data.authToken)
      .set("subTodoName", data.subTodoName)
      .set("subTodoModifiedBy", data.subTodoModifiedBy);

    return this._http.post(
      `${this.baseUrl}/todo/${data.subTodoId}/updatesubTodo`,
      params
    );
  }

  public deleteList(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/lists/${data.ListId}/deleteList`,
      params
    );
  }

  //For recursive delete of todo and sub todo
  public deleteAllSubTodosById(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/todo/${data.id}/deleteSubTodo`,
      params
    );
  }

  public deleteAllTodosById(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/todo/${data.todoId}/deleteTodo`,
      params
    );
  }

  //For deleting single sub todo
  public deletesubTodo(data): any {
    const params = new HttpParams().set("authToken", data.authToken);
    return this._http.post(
      `${this.baseUrl}/todo/${data.subTodoId}/deletesubTodo`,
      params
    );
  }

  //For deleting Undo
  public deleteUndo(data): any {
    const params = new HttpParams()
      .set("undoId", data.undoId)
      .set("authToken", data.authToken);
    return this._http.post(`${this.baseUrl}/undo/deleteUndo`, params);
  }

  public resetPassword(data): Observable<any> {
    const params = new HttpParams().set("email", data.email);

    return this._http.post(`${this.baseUrl}/users/resetPassword`, params);
  }

  public updatePassword(data): Observable<any> {
    const params = new HttpParams()
      .set("validationToken", data.validationToken)
      .set("password", data.password);

    return this._http.put(`${this.baseUrl}/users/updatePassword`, params);
  } //end updatePassword

  public getUndo(data): any {
    const params = new HttpParams()
      .set("listId", data.listId)
      .set("authToken", data.authToken);

    return this._http.post(`${this.baseUrl}/undo/deleteUndo`, params);
  }

  public addUndoDetails(data): any {
    const params = new HttpParams()
      .set("listId", data.listId)
      .set("action", data.action)
      .set("todoId", data.todoId)
      .set("subTodoId", data.subTodoId)
      .set("authToken", data.authToken);
    return this._http.post(`${this.baseUrl}/undo/addUndo`, params);
  }

  public updateTodoTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerList", data.ownerList)
      .set("todoCreatedBy", data.todoCreatedBy)
      .set("todoModifiedBy", data.todoModifiedBy)
      .set("completed", data.completed)
      .set("todoModifiedDate", data.todoModifiedDate)
      .set("todoCreatedDate", data.todoCreatedDate)
      .set("todoDescription", data.todoDescription)
      .set("todoName", data.todoName)
      .set("todoId", data.todoId);
    return this._http.post(`${this.baseUrl}/undo/updateTodoUndo`, params);
  }

  public updatesubTodoTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerTodo", data.ownerTodo)
      .set("subTodoCreatedBy", data.subTodoCreatedBy)
      .set("subTodoModifiedBy", data.subTodoModifiedBy)
      .set("completed", data.completed)
      .set("subTodoModifiedDate", data.subTodoModifiedDate)
      .set("subTodoCreatedDate", data.subTodoCreatedDate)
      .set("subTodoDescription", data.subTodoDescription)
      .set("subTodoName", data.subTodoName)
      .set("subTodoId", data.subTodoId);
    return this._http.post(`${this.baseUrl}/undo/updatesubTodoUndo`, params);
  }

  public addTodoTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerList", data.ownerList)
      .set("todoCreatedBy", data.todoCreatedBy)
      .set("todoModifiedBy", data.todoModifiedBy)
      .set("subtodo", data.subtodo)
      .set("completed", data.completed)
      .set("todoModifiedDate", data.todoModifiedDate)
      .set("todoCreatedDate", data.todoCreatedDate)
      .set("todoDescription", data.todoDescription)
      .set("todoName", data.todoName)
      .set("todoId", data.todoId);
    return this._http.post(`${this.baseUrl}/undo/addTodoUndo`, params);
  }

  public addsubTodoTaskForUndo(data): any {
    const params = new HttpParams()
      .set("_id", data._id)
      .set("ownerTodo", data.ownerTodo)
      .set("subTodoCreatedBy", data.subTodoCreatedBy)
      .set("subTodoModifiedBy", data.subTodoModifiedBy)
      .set("completed", data.completed)
      .set("subTodoModifiedDate", data.subTodoModifiedDate)
      .set("subTodoCreatedDate", data.subTodoCreatedDate)
      .set("subTodoDescription", data.subTodoDescription)
      .set("subTodoName", data.subTodoName)
      .set("subTodoId", data.subTodoId);
    return this._http.post(`${this.baseUrl}/undo/addsubTodoUndo`, params);
  }
}
