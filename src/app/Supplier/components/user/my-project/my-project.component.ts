import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService } from 'src/app/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss']
})
export class MyProjectComponent implements OnInit {

  NoticeListTendering: any = [];
  totalCountTendering = 0;
  Code: string;

  constructor(
    private message: NzMessageService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.Code = params.get('Code');
      this.FindProjectPar(15, 1);
    });
  }

  // 查询参与过的项目
  FindProjectPar(pageSize: number, pageIndex: number) {
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
          fieldValue: this.Code
        }
      ],
      pageIndex,
      pageSize
    };
    this.dao.doPostRequest(this.SHPurchase.PurchaseProjSupPar, postData).subscribe((res: any) => {
      // console.log(res);
      this.NoticeListTendering = res.data.dataList;
      let i: number; i = 0;
      for (i; i < this.NoticeListTendering.length; i++) {
        this.NoticeListTendering[i].noticeName = this.NoticeListTendering[i].projectName;
      }
      // console.log(this.NoticeListTendering);
      this.totalCountTendering = res.data.totalCount;
    }, (err: any) => {
      console.log(err);
    });
  }

  ToTenderingInfo(bizId: string) {
    // { skipLocationChange: true }
    this.router.navigate(['project/info', bizId]);
  }

}
