import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {


  constructor() { }

  @Input() date: string;     // 父组件传来的截止时间   "2019/12/28 12:00:00"
  @Input() finishWorld: string;     // “已截止”  截止显示的文字

  public sec = 0;   // 截止时间戳 减 当前时间戳
  // public temp: number
  public DD: any = 0;    // 倒计时 天
  public HH: any = 0;    // 倒计时 时
  public MM: any = 0;  // 倒计时 分
  public SS: any = 0;   // 倒计时 秒
  countDown: any;
  // public CountDown: any = '00:00:00'
  // ifDo = true;

  TimeType(DD: number) {
    if (DD < 10) {
      return (0 + DD.toString()).toString();
    } else {
      return DD.toString();
    }
  }


  ngOnInit() {
    const that = this;

    setTimeout(() => {
      that.countDown = setInterval(() => {
        if (that.sec >= 0) {

          that.sec = parseInt(((new Date(that.date).getTime() - new Date(new Date()).getTime()) / 1000).toString(), 10);
          that.DD = that.TimeType(parseInt((that.sec / 86400).toString(), 10));
          that.HH = that.TimeType(parseInt(((that.sec - that.DD * 86400) / 3600).toString(), 10));
          that.MM = that.TimeType(parseInt(((that.sec - that.DD * 86400 - that.HH * 3600) / 60).toString(), 10));
          that.SS = that.TimeType(parseInt((that.sec - that.DD * 86400 - that.HH * 3600 - that.MM * 60).toString(), 10));

        } else {
          clearInterval(this.countDown);
        }
      }, 100);   // 每秒执行10次
    }, 1000);


  }

  ngOnDestroy() {
    // this.ifDo = false;
    clearInterval(this.countDown);
    // console.log('countDown.doDestroy')
  }


}
