import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService, SharedService } from 'src/app/core';

@Component({
  selector: 'app-supplierind',
  templateUrl: './supplierind.component.html',
  styleUrls: ['./supplierind.component.scss']
})
export class SupplierindComponent implements OnInit, OnDestroy {
  // ifDo = true;
  // ifDo2 = true;

  isSpinning = false;
  isSpinning2 = false;
  categoryFirstList: any = [];
  orgList: any = [];
  public ind = 1;
  public ind2 = 1;
  totalCount: number = null;
  totalCount2: number = null;
  aaa: string[][] = [];


  constructor(
    public router: Router,
    private message: NzMessageService,
    public shared: SharedService,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }

  ngOnInit() {
    this.FindCategoryFirst(5, 1);
    this.FindOrgList(5, 1);
  }

  ngOnDestroy() {
  }

  doStringArray(str: string) {
    return str.split('');
  }

  // 刷新、查找一级分类 分页
  FindCategoryFirst(pageSize: number, pageIndex: number) {
    this.isSpinning = true;
    const postData = {
      queryFields: '',
      queryWhere: [
        {
          fieldName: 'state',
          operator: 'Equal',
          fieldValue: 1
        }
      ],
      queryOrder: 'categoryFirName',
      pageIndex,
      pageSize
    };
    this.dao.doPostRequest(this.SHPurchase.PurchaseFirSearch, postData).subscribe((res: any) => {
      this.categoryFirstList = res.data.dataList;
      // console.log(this.categoryFirstList);
      this.totalCount = res.data.totalCount;
      this.isSpinning = false;
    }, (err: any) => {
      console.log(err);
      this.isSpinning = false;
      // this.message.create('warning', err.error.message);
    });
  }

  // 查询组织列表
  FindOrgList(pageSize: number, pageIndex: number) {
    this.isSpinning2 = true;

    const postData = {
      queryFields: '',
      queryOrder: 'shortName',
      queryWhere: [
        {
          fieldName: 'isLegacyOrg',
          operator: 'equal',
          fieldValue: 'true'
        }
      ],
      pageIndex,
      pageSize
    };
    // const tokenCopy = sessionStorage.getItem('token');
    // sessionStorage.removeItem('token');
    //  {
    //   headers: { Authorization: this.SHPurchase.orgApiToken }
    // }
    this.dao.doPostRequest(this.SHPurchase.OrgSearch, postData).subscribe((res: any) => {
      this.isSpinning2 = false;
      this.orgList = res.data.dataList;
      this.totalCount2 = res.data.totalCount;
      // console.log(this.orgList)
      // sessionStorage.setItem('token', tokenCopy);
    }, (err: any) => {
      console.log(err);
      this.isSpinning2 = false;
      // this.message.create('warning', err.error.message);
      // sessionStorage.setItem('token', tokenCopy);
    });


  }


  IndexChange() {
    setTimeout(() => {
      this.FindOrgList(5, this.ind);
    }, 100);
  }

  IndexChange2() {
    setTimeout(() => {
      this.FindCategoryFirst(5, this.ind2);
    }, 100);
  }

  doSearch(key: string) {
    const that = this;
    this.shared.keyWordSearch = key;
    that.router.navigate(['search', key]);
  }

}
