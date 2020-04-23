import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // visible = false;

  constructor(public shared: SharedService, public router: Router) { }

  ngOnInit() {
  }

  open() {
    this.shared.visible = true;
  }

  supInfo() {
    this.shared.visible3 = true;
  }


  close() {
    this.shared.visible = false;
    this.shared.visible3 = false;
  }

}
