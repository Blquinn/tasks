import { Component, OnInit } from '@angular/core';
// import remote = Electron.remote;
import * as Electron from 'electron';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title: String = 'Wunderbar';

  constructor() {
  }

  ngOnInit() {
  }

}
