import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface TodoClass {
  _id: string;
  _idList: string;
  completed: boolean;
  title: string;
}

@Injectable()
export class HttpService {
  server = 'http://localhost:4201/';

  constructor(private http: HttpClient) {}

  getData(): any  {
    return this.http.get(this.server);
  }

  postList(newList: string): any {
    const body = { title: newList };
    return this.http.post(this.server, body);
  }

  postTodo(newCurrentTodo: any): any  {
    const body = {
      _idList: newCurrentTodo._idList,
      title: newCurrentTodo.title,
      completed: newCurrentTodo.completed,
    };
    return this.http.post(this.server, body);
  }

  putTodo(newTodo: TodoClass): any  {
    return this.http.put(this.server, newTodo);
  }
}
