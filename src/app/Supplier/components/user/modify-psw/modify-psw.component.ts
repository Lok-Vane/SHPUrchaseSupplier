import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { DaoService, SHPurchaseSettinggService, SharedService } from 'src/app/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-modify-psw',
  templateUrl: './modify-psw.component.html',
  styleUrls: ['./modify-psw.component.scss']
})
export class ModifyPswComponent implements OnInit, AfterViewInit {

  pswData: any = {
    old: null,
    new: null,
    new2: null
  };
  isSpinning = false;

  constructor(
    public dao: DaoService,
    public shared: SharedService,
    public SHPurchase: SHPurchaseSettinggService,
    private message: NzMessageService,
    private eleRef: ElementRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log('open');
    setTimeout(() => {
      this.eleRef.nativeElement.querySelector('#old').focus();
    }, 100);

  }

  Enter(event: KeyboardEvent) {

    // 回车
    if (event.keyCode === 13) {
      this.ModifyPSW();
    }

  }

  ModifyPSW() {
    if (this.pswData.old === null || this.pswData.old === '') {
      this.message.create('error', '原密码不得为空！');
      this.eleRef.nativeElement.querySelector('#old').focus();
    } else if (this.pswData.new === null || this.pswData.new === '') {
      this.message.create('error', '新密码不得为空！');
      this.eleRef.nativeElement.querySelector('#new').focus();
    } else if (this.pswData.new2 === null || this.pswData.new2 === '') {
      this.message.create('warning', '请确认新密码！');
      this.eleRef.nativeElement.querySelector('#new2').focus();
    } else if (this.pswData.old === this.pswData.new) {
      this.message.create('warning', '新密码不得与原密码相同！');
      this.pswData.new = null;
      this.pswData.new2 = null;
      this.eleRef.nativeElement.querySelector('#new').focus();
    } else if (this.pswData.new2 !== this.pswData.new) {
      this.message.create('error', '新密码两次输入不一致！');
      this.pswData.new2 = null;
      this.eleRef.nativeElement.querySelector('#new2').focus();
    } else {
      this.doModifyPSW();
    }
  }

  doModifyPSW() {
    this.isSpinning = true;
    const postData = {
      code: JSON.parse(sessionStorage.getItem('supLogin')).supplierCode,
      oldPassword: this.pswData.old,
      newPassword: this.pswData.new
    };
    this.dao.doPostRequest(this.SHPurchase.PurchaseSupModifyPsw, postData).subscribe((res: any) => {
      this.pswData = {
        old: null,
        new: null,
        new2: null
      };
      this.isSpinning = false;
      this.shared.visible2 = false;
    }, (err: any) => {
      this.pswData = {
        old: null,
        new: null,
        new2: null
      };
      this.isSpinning = false;
    });
  }

}
