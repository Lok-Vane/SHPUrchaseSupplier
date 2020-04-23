import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService } from 'src/app/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  NoticeListTendering: any = [];
  totalCountTendering = 0;

  constructor(
    private message: NzMessageService,
    public router: Router,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }

  ngOnInit() {
    this.FindNoticeListTendering(15, 1);
  }

  // 查询招标公告
  FindNoticeListTendering(pageSize: number, pageIndex: number) {
    const postData = {
      queryFields: '',
      // queryOrder: "orgSName",
      queryOrder: 'createdTime desc',
      queryWhere: [
        {
          fieldName: 'nState',
          operator: 'Equal',
          fieldValue: 2
        }
      ],
      pageIndex,
      pageSize
    };
    this.dao.doPostRequest(this.SHPurchase.PurchaseNoticeSearch, postData).subscribe((res: any) => {
      // console.log(res);
      this.NoticeListTendering = res.data.dataList;
      this.totalCountTendering = res.data.totalCount;
    }, (err: any) => {
      console.log(err);
      // this.message.create('warning', err.error.message);
    });
  }

  ToTenderingInfo(bizId: string) {
    this.router.navigate(['project/info', bizId]);
  }

  toTendering() {
    this.router.navigateByUrl('/tendering');
  }

}
