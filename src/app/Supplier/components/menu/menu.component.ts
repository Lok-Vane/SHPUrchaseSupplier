import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import * as $ from 'jquery';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  pdfSrc = 'assets/pdf/BiddingNotice.pdf';
  visible = false;
  constructor(
    public shared: SharedService,
    private message: NzMessageService,
    public router: Router
  ) { }

  ngOnInit() {
  }


  logout() {
    this.visible = true;
  }

  modifyPSW() {
    this.shared.visible2 = true;
  }

  supInfo() {
    this.shared.visible3 = true;
  }

  doLogout() {
    this.shared.doLogout();
    this.router.navigateByUrl('/index');
    this.visible = false;
    this.message.create('warning', '已登出！');
  }

  close() {
    this.visible = false;
    this.shared.visible2 = false;
    this.shared.visible3 = false;
  }

  toMyPro() {
    this.router.navigate(['user/myPro', JSON.parse(sessionStorage.getItem('supLogin')).supplierCode]);
  }

  toMyServices() {
    this.router.navigate(['user/myServices', JSON.parse(sessionStorage.getItem('supLogin')).supplierCode]);
  }

  showPdf() {
    const $form = $('<form method="GET" target="_blank"></form>');

    $form.attr('action', this.pdfSrc);

    $form.appendTo($('body'));

    $form.submit();
  }

}
