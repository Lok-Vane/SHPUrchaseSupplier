import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { DaoService, SHPurchaseSettinggService, SharedService } from 'src/app/core';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginPost: any = {
    phone: null,
    password_sup: null,
  };

  isSpinning = false;

  constructor(
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService,
    public shared: SharedService,
    public message: NzMessageService,
    private eleRef: ElementRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // console.log('open');
    setTimeout(() => {
      this.eleRef.nativeElement.querySelector('#phone').focus();
    }, 100);

  }

  Enter(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      if (this.loginPost.phone !== null
        && this.loginPost.phone !== '') {
        this.eleRef.nativeElement.querySelector('#psw').focus();
        if (this.loginPost.password_sup !== null
          && this.loginPost.password_sup !== '') {
          this.doLogin();
        } else {
          this.message.create('error', '密码不得为空！');
        }

      } else {
        this.message.create('error', '手机号码不得为空！');
      }
    }
  }

  doLogin() {
    this.isSpinning = true;
    this.dao.doPostRequest(this.SHPurchase.PurchaseSupLogin, this.loginPost).subscribe((res: any) => {
      this.shared.supplierData = res.data;
      sessionStorage.setItem('supLogin', JSON.stringify(res.data));
      // console.log(JSON.parse(sessionStorage.getItem('supLogin')));
      this.shared.ifLogin = true;
      // console.log(this.shared.supplierData);
      this.shared.visible = false;
      this.isSpinning = false;
    }, (err: any) => {
      this.isSpinning = false;
      console.log(err);
      this.loginPost.password_sup = null;
    });
  }

}
