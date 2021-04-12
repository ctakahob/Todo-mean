import { Component, OnInit } from '@angular/core';
import {
  MatRadioChange,
  MAT_RADIO_DEFAULT_OPTIONS,
} from '@angular/material/radio';
import { HttpService } from './rest.datasource';

interface Todo {
  _id: string;
  _idList: string;
  title: string;
  completed: boolean;
}

interface TodoList {
  _id: string;
  title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    HttpService,
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class AppComponent implements OnInit {
  titleHead = 'MEAN';
  filter = false;
  listOfLists = true;
  currentIdList: string;
  newNameForList: string;
  searchText: RegExp;
  errorList: any;
  errorTodo: any;
  noTodo = true;
  todoLists: TodoList[] = [];
  todos: Todo[] = [];
  undeadSong: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): any {
    this.httpService.getData().subscribe(
      (data) => (this.todoLists = data[0]),
      (error) => {
        this.errorList = error.message;
        console.log(error);
      }
    );
    this.httpService.getData().subscribe(
      (data) => {
        this.todos = data[1];
      },
      (error) => {
        this.errorTodo = error.message;
        console.log(error);
      }
    );
  }

  playSound(sound: string): any {
    sound = '../assets/sounds/' + sound + '.mp3';
    // tslint:disable-next-line:no-unused-expression
    sound && new Audio(sound).play();
  }

  clickCreate(): void {
    if (this.newNameForList.trim()) {
      this.httpService.postList(this.newNameForList).subscribe(
        (data: TodoList) => {
          (this.newNameForList = ''), this.todoLists.push(data);
        },
        (error) => console.log(error)
      );
    } else {
      this.newNameForList = '';
    }
  }

  inList(id: string): void {
    this.listOfLists = false;
    this.currentIdList = id;
    if (!this.todos.filter((item) => item._idList === id).length) {
      this.noTodo = false;
    }
  }

  newTodo(value: string): void {
    if (value.trim()) {
      const newCurrentTodo = {
        _idList: this.currentIdList,
        title: value,
        completed: false,
      };
      this.httpService.postTodo(newCurrentTodo).subscribe(
        (data: Todo) => {
          this.todos.push(data),
            (this.noTodo = true),
            ((document.getElementById('inputTodo') as HTMLInputElement).value =
              '');
        },
        (error) => console.log(error)
      );
    } else {
      (document.getElementById('inputTodo') as HTMLInputElement).value = '';
    }
  }

  changeDone(id: string): void {
    const editTodo = this.todos.find((item) => item._id === id);
    editTodo.completed = !editTodo.completed;
    this.httpService.putTodo(editTodo).subscribe((data: Todo) => {
      this.todos.forEach((item) => {
        if (item._id === id) {
          item.completed = true;
        }
      });
    });
  }

  changeFilter(event: MatRadioChange): void {
    this.filter = !this.filter;
  }

  counterAll(id: string): number {
    if (this.todos.length) {
      return this.todos.filter((item) => item._idList === id).length;
    } else {
      return 0;
    }
  }

  counterCompleted(id: string): number {
    if (this.todos.length) {
      return this.todos
        .filter((item) => item._idList === id)
        .filter((item) => item.completed === true).length;
    } else {
      return 0;
    }
  }

  searchTodo(text: string): boolean {
    if (this.searchText) {
      return this.searchText.test(text);
    }
  }

  searchValue(Event: any): void {
    if (Event) {
      this.searchText = new RegExp(Event.target.value, 'gi');
    }
  }

  searchTextReset(): void {
    this.searchText = undefined;
  }
}
