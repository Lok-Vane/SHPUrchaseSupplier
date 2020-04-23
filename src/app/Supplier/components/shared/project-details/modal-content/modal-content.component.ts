import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss']
})
export class ModalContentComponent implements OnInit, OnDestroy, OnChanges {

  @Input() data: any = [];     // 报价、排名详情
  @Input() num = 0;     // 出价次数
  @Input() title = 'Tips';

  constructor() { }

  ngOnInit() {
    // console.log(this.data);
    // console.log(this.num);
  }

  ngOnChanges() {
    // console.log(this.data);
    // console.log(this.num);
  }

  ngOnDestroy() {

  }

}
