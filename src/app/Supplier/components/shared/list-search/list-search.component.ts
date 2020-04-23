import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService } from 'src/app/core';

@Component({
  selector: 'app-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.scss']
})
export class ListSearchComponent implements OnInit, OnDestroy, OnChanges {

  @Input() Notices: any;     // 公告数据
  @Input() header: any;     // 公告头部
  // @Input() displayNum: number;     //每页显示条数
  @Input() clickFind: any;     // 点击事件（单个项目）
  // @Input() ifTail: boolean;     //是否显示尾部
  // @Input() clickMore: any;     //尾部点击事件（更多）
  @Input() totalCount: any;     // 数据总数
  @Input() keyWordSearch: string;     // 搜索关键字
  @Input() nState: number;        // 公告类型

  ind = 1;
  numOfNgOnChanges = 0;    // 已调用ngOnChanges()的次数
  ifDo = true;
  ifDo2 = true;

  NOW: any = null;

  isSpinning = false;
  countDown: any;

  constructor(
    private message: NzMessageService,
    public router: Router,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }

  ngOnInit() {

    const that = this;

    this.countDown = setInterval(() => {

      that.NOW = new Date().getTime();
    }, 100);   // 每秒执行10次

  }


  ngOnChanges() {
    // console.log('ngOnChanges' + ' ' + this.totalCount);
    if (this.numOfNgOnChanges === 0) {
      this.isSpinning = true;
      this.numOfNgOnChanges++;
    } else if (this.numOfNgOnChanges !== 0) {
      this.isSpinning = false;
      this.numOfNgOnChanges++;
      if (this.totalCount === 0) {
        this.message.create('warning', '暂无数据！');
      }
    }
  }

  ngOnDestroy() {
    clearInterval(this.countDown);
    console.log('countDown.doDestroy');
  }

  getTimeStamp(time: any) {
    return new Date(time).getTime();
  }

  titleTips(item: any) {
    if (this.getTimeStamp(item.finalTime) >= this.NOW && this.getTimeStamp(item.startTime) <= this.NOW) {
      if (this.getTimeStamp(item.endTime) > this.NOW) {
        return item.endTime + ' ' + '截止';
      }
      if (this.getTimeStamp(item.endTime) <= this.NOW) {
        return item.finalTime + ' ' + '截止';
      }
    }
    if (this.getTimeStamp(item.startTime) > this.NOW) {
      return item.startTime + ' ' + '开始';
    }
    if (this.getTimeStamp(item.finalTime) < this.NOW) {
      return '已截止';
    }
  }

  // 查询公告    keyWordSearch    nState
  tendering_Search(pageSize: number, pageIndex: number) {

    this.isSpinning = true;
    this.dao.doPostRequest(this.SHPurchase.PurchaseNoticeSearch, {
      queryOrder: 'createdTime desc',
      queryWhere: [
        {
          fieldName: 'noticeName',
          operator: 'Like',
          fieldValue: this.keyWordSearch
        },
        {
          fieldName: 'nState',
          operator: 'Equal',
          fieldValue: this.nState
        }
      ],
      pageIndex,
      pageSize
    }).subscribe((res: any) => {
      this.isSpinning = false;
      this.Notices = res.data.dataList;
      // console.log(res);

    }, (err: any) => {
      this.isSpinning = false;
      console.log(err);
      // this.message.create('warning', err.error.message);
    });

  }

  IndexChange() {
    setTimeout(() => {
      this.tendering_Search(15, this.ind);
    }, 100);
  }


}
