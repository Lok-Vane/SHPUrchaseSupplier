import { Component, OnInit } from '@angular/core';
import { SharedService } from '../core';

@Component({
  selector: 'app-supplier',
  templateUrl: './Supplier.component.html',
  styleUrls: ['./Supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  constructor(public shared: SharedService) { }

  ngOnInit() {
    // 检验是否已登录
    if (sessionStorage.getItem('supLogin') !== null) {
      this.shared.supplierData = JSON.parse(sessionStorage.getItem('supLogin'));
      this.shared.ifLogin = true;
    }
  }


}
