import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(public message: NzMessageService) { }

  keyWordSearch: string = null;

  // 二级分类列表
  categorySecondList: any = [];

  supplierData: any = {
    phone: null,
    supplierBizId: null,
    supplierCode: null,
    supplierName: null,
    token: null,
  };

  visible = false;
  visible2 = false;
  visible3 = false;
  ifLogin = false;

  doLogout() {
    this.supplierData = {
      phone: null,
      supplierBizId: null,
      supplierCode: null,
      supplierName: null,
      token: null,
    };
    this.ifLogin = false;
    sessionStorage.clear();
    // this.message.create('warning', '已登出！');
  }

}
