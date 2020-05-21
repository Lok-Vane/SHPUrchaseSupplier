import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DaoService, SHPurchaseSettinggService, SharedService } from 'src/app/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-sup-info',
  templateUrl: './sup-info.component.html',
  styleUrls: ['./sup-info.component.scss']
})
export class SupInfoComponent implements OnInit {

  isSpinning = false;
  supInfo: any = {};

  constructor(
    private message: NzMessageService,
    public router: Router,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService,
    public shared: SharedService
  ) { }

  ngOnInit() {
    this.isSpinning = true;
    this.dao.doPostRequest(this.SHPurchase.PurchaseSupByCode,
      JSON.parse(sessionStorage.getItem('supLogin')).supplierCode).subscribe((res: any) => {
        // console.log(res);
        this.supInfo = res.data;
        this.isSpinning = false;
      }, (err: any) => {
        this.isSpinning = false;
        this.shared.visible3 = false;
      });
  }

  toPSW() {
    const that = this;
    this.shared.visible3 = false;
    setTimeout(() => {
      that.shared.visible2 = true;
    }, 500);
  }

  toMyServices() {
    const that = this;
    this.shared.visible3 = false;
    setTimeout(() => {
      that.router.navigate(['user/myServices', JSON.parse(sessionStorage.getItem('supLogin')).supplierCode]);
    }, 500);
  }

  toMyPro() {
    const that = this;
    this.shared.visible3 = false;
    setTimeout(() => {
      that.router.navigate(['user/myPro', JSON.parse(sessionStorage.getItem('supLogin')).supplierCode]);
    }, 500);
  }

  successFun(e, t) {
    this.message.create('success', t + ' 复制成功');
  }

}
