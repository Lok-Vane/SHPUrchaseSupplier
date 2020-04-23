import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService } from 'src/app/core';

@Component({
  selector: 'app-list-my',
  templateUrl: './list-my.component.html',
  styleUrls: ['./list-my.component.scss']
})
export class ListMyComponent implements OnInit, OnDestroy, OnChanges {

  constructor(
    private message: NzMessageService,
    public router: Router,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }


  @Input() Notices: any;     // 公告数据
  @Input() header: any;     // 公告头部
  // @Input() displayNum: number;     // 每页显示条数
  @Input() clickFind: any;     // 点击事件（单个项目）
  @Input() clickMore: any;     // 尾部点击事件（更多）
  @Input() totalCount: any;     // 数据总数
  ind = 1;

  numOfNgOnChanges = 0;    // 已调用ngOnChanges()的次数
  NOW: any = null;

  isSpinning = false;
  countDown: any;


  ngOnInit() {

    const that = this;

    this.countDown = setInterval(() => {

      that.NOW = new Date().getTime();
    }, 100);   // 每秒执行10次
  }

  /** 当被绑定的输入属性（@input）的值发生变化时调用，
   * 首次调用一定会发生在 ngOnInit之前。
   * ngOnChanges()方法获取了一个对象，
   * 它可以同时观测多个绑定的属性值，
   * 它把每个发生变化的属性名都映射到了一个SimpleChange对象，
   * 该对象中有属性的当前值和前一个值
   */
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
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
    // console.log('countDown.doDestroy')
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

  // 查询参与过的项目
  FindProjectPar(pageSize: number, pageIndex: number) {
    this.isSpinning = true;
    const postData = {
      queryFields: '',
      queryOrder: 'partTime desc',
      queryWhere: [
        {
          fieldName: 'partType',
          operator: 'Equal',
          fieldValue: 2
        },
        {
          fieldName: 'supplierCode',
          operator: 'Equal',
          fieldValue: JSON.parse(sessionStorage.getItem('supLogin')).supplierCode
        }
      ],
      pageIndex,
      pageSize
    };
    this.dao.doPostRequest(this.SHPurchase.PurchaseProjSupPar, postData).subscribe((res: any) => {
      // console.log(res);
      this.Notices = res.data.dataList;
      let i: number; i = 0;
      for (i; i < this.Notices.length; i++) {
        this.Notices[i].noticeName = this.Notices[i].projectName;
      }
      // console.log(this.Notices);
      this.Notices = res.data.totalCount;
      this.isSpinning = false;
    }, (err: any) => {
      console.log(err);
      this.isSpinning = false;
    });
  }

  IndexChange() {
    if (this.header === '我的竞价') {
      setTimeout(() => {
        this.FindProjectPar(15, this.ind);
      }, 100);
    }
  }

}
