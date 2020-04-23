import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {


  constructor(public shared: SharedService, private message: NzMessageService, public router: Router) { }

  ngOnInit() {
  }

  doSearch() {
    if (this.shared.keyWordSearch === '' || this.shared.keyWordSearch === null) {
      this.message.create('warning', '搜索关键字不得为空');
    } else {
      this.router.navigate(['search', this.shared.keyWordSearch]);
    }
  }

  enter(event: KeyboardEvent) {

    // 回车
    if (event.keyCode === 13) {
      this.doSearch();
    }

  }
}
