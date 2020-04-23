import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService, SharedService } from 'src/app/core';

@Component({
  selector: 'app-search-info',
  templateUrl: './search-info.component.html',
  styleUrls: ['./search-info.component.scss']
})
export class SearchInfoComponent implements OnInit {
  isSpinning = false;
  keyWordSearch: string;
  SearchListTendering: any = [];
  totalCountSearch: number = null;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    public shared: SharedService,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }

  ngOnInit() {
    // this.isSpinning = true;
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.keyWordSearch = params.get('key');
      // console.log(this.keyWordSearch);
      this.tendering_Search(15, 1);
    });
  }

  tendering_Search(pageSize: number, pageIndex: number) {

    this.dao.doPostRequest(this.SHPurchase.PurchaseNoticeSearch, {
      queryOrder: 'createdTime desc',
      queryWhere: [
        {
          fieldName: 'noticeName',
          operator: 'Like',
          fieldValue: this.keyWordSearch
        },
        {
          fieldName: 'nState',
          operator: 'Equal',
          fieldValue: 2
        }
      ],
      pageIndex,
      pageSize
    }).subscribe((res: any) => {
      // this.isSpinning = false;
      this.totalCountSearch = res.data.totalCount;
      this.SearchListTendering = res.data.dataList;
      // if (this.totalCountSearch === 0) {
      //   this.message.create('warning', '暂无数据！');
      // }
      // console.log(res);

    }, (err: any) => {
      // this.isSpinning = false;
      console.log(err);
      // this.message.create('warning', err.error.message);
    });

  }

  ToTenderingInfo(bizId: string) {
    this.router.navigate(['project/info', bizId]);
  }

  getTitle(key: string) {
    return '“' + key + '” 搜索结果';
  }

}
