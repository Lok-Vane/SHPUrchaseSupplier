import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DaoService, SHPurchaseSettinggService, SharedService } from 'src/app/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {

  bizId: string = null;
  isSpinning = false;
  data: any = [];
  disabled = true;

  NOW: any = null;
  countDown: any;      // 刷新当前时间
  countDown2: any;     // 刷新finalTime、isSuccess
  countDown3: any;     // 刷新排名、历史报价弹窗
  buttonMsg = '当前竞价人数';
  isVisible = false;
  isVisiblePdf = false;
  pdfSrc = 'assets/pdf/BiddingNotice.pdf';
  page = 1;
  ifAgree = false;
  isVisiblePdf2 = false;

  NumOfBidders = 0;
  tipsTitle = 'Tips(10秒自动刷新)';
  postPriceList: any = [];   // 绑定输入框
  settlementList: any = [];   // 结算方式列表
  historyPriceList: any = [];   // 供应商历史出价列表
  rankingList: any = [];   // 供应商当前排名列表
  showList: any = [];   // 弹窗数据封装列表

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService,
    public shared: SharedService
  ) { }

  formatterRMB = (value: number) => `${(value * 1).toFixed(2)} 元`;
  parserRMB = (value: string) => value.replace(' 元', '');
  formatterPercent = (value: number) => `${(value * 100).toFixed(2)} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  formatterPercentage(ind: number) {
    if (this.postPriceList[ind].quotedPriceTax > 1) {
      this.postPriceList[ind].quotedPriceTax = (this.postPriceList[ind].quotedPriceTax / 100).toFixed(4);
    } else if (this.postPriceList[ind].quotedPriceTax !== 0) {
      this.postPriceList[ind].quotedPriceTax = this.postPriceList[ind].quotedPriceTax.toFixed(4);
    }
  }
  formatterPercentage2(ind: number) {
    if (this.postPriceList[ind].freightQuotedTax > 1) {
      this.postPriceList[ind].freightQuotedTax = (this.postPriceList[ind].freightQuotedTax / 100).toFixed(4);
    } else if (this.postPriceList[ind].freightQuotedTax !== 0) {
      this.postPriceList[ind].freightQuotedTax = this.postPriceList[ind].freightQuotedTax.toFixed(4);
    }
  }

  ngOnInit() {
    const that = this;
    that.isSpinning = true;
    // this.isVisiblePdf = true;

    // 数据字典查询、结算方式settlement
    that.dao.doPostRequest(that.SHPurchase.PurchaseDicSearch, {
      queryWhere: [
        {
          fieldName: 'classify',
          operator: 'Equal',
          fieldValue: 1
        },
        {
          fieldName: 'state',
          operator: 'Equal',
          fieldValue: 1
        }
      ]
    }).subscribe((res: any) => {
      that.settlementList = res.data.dataList;
    }, (err: any) => {

    });

    that.activatedRoute.paramMap.subscribe((params: any) => {
      that.bizId = params.get('bizId');

      const postData = {
        queryFields: '',
        queryWhere: [
          {
            fieldName: 'bizId',
            operator: 'Equal',
            fieldValue: that.bizId
          }
        ]
      };
      const postData2 = {
        queryWhere: [
          {
            fieldName: 'partType',
            operator: 'Equal',
            fieldValue: 2
          },
          {
            fieldName: 'supplierCode',
            operator: 'Equal',
            fieldValue:
              sessionStorage.getItem('supLogin') ? JSON.parse(sessionStorage.getItem('supLogin')).supplierCode : null
          },
          {
            fieldName: 'projectID',
            operator: 'Equal',
            fieldValue: that.bizId
          }
        ],
      };
      that.dao.doPostRequest(that.SHPurchase.PurchaseBidSearchSup, postData).subscribe((res: any) => {
        that.dao.doPostRequest(that.SHPurchase.PurchaseProjSupPar, postData2).subscribe((res1: any) => {
          if (res1.data.totalCount !== 1 && res.data.dataList[0].isSuccess === 1) {
            // 未参与过此项目，并且项目未截止，弹出“竞价参与须知”
            this.isVisiblePdf = true;
          }
        }, (err1: any) => {
          console.log(err1);
          // 查询参与记录报错，无差别弹出“竞价参与须知”
          this.isVisiblePdf = true;
        });
        that.data = res.data.dataList[0];
        that.data.seedGoodsTime = that.data.seedGoodsTime.substring(0, 10);
        if (that.data.totalAmount !== null) {
          that.data.totalAmount = Number(that.data.totalAmount).toFixed(2).toString();
        }
        // 获取一级分类名称
        that.getCategoryFirName();
        that.isSpinning = false;
        // 若项目未截止，没5秒刷新finalTime、isSuccess
        if (that.data.isSuccess === 1) {
          that.getTIME();
        }

        that.countDown = setInterval(() => {
          that.NOW = new Date().getTime();
          that.disabled = that.getTimeStamp(that.data.startTime) < that.NOW ? false : true;
          // 若项目截止，停止更新finalTime、isSuccess
          if (that.data.isSuccess !== 1) {
            clearInterval(that.countDown2);
          }

        }, 100);   // 每秒执行10次

        let i: number; i = 0;
        for (i; i < that.data.contentDtos.length; i++) {
          that.postPriceList.push({
            supplierCode: that.shared.supplierData.supplierCode,
            projectID: that.data.bizId,
            biddingId: that.data.contentDtos[i].bizId,
            settlement: that.data.contentDtos[i].reserve3 == null ? null : that.data.contentDtos[i].reserve3,     // 结算方式
            quotedPrice: 0,   // 最终总报价
            price: 0,     // 材料报价裸价
            quotedPriceTax: that.data.contentDtos[i].reserve2 == null ? 0 : that.data.contentDtos[i].reserve2,    // 材料税率
            offerPrice: 0,       // 材料税后报价
            isOneVote: false,       // 是否两票制
            freightPrice: 0,         // 运费单价
            freightQuotedTax: that.data.contentDtos[i].reserve4 == null ? 0 : that.data.contentDtos[i].reserve4,    // 运费税率
            freightQuotedPrice: 0,      // 税后运费
            otherPrice: 0
          });
        }

      }, (err: any) => {
        console.log(err);
        // this.isSpinning = false;
        // that.router.navigateByUrl('/index');
        // if (that.shared.ifLogin === true) {
        //   that.shared.doLogout();
        // }
      });

    });

  }

  ngOnDestroy() {
    clearInterval(this.countDown);
    clearInterval(this.countDown2);
    clearInterval(this.countDown3);
    // this.close();
  }

  getTimeStamp(time: any) {
    return new Date(time).getTime();
  }

  // 绑定报价输入框
  bindPrice(i: number) {
    this.postPriceList[i].price =
      Number((this.postPriceList[i].offerPrice / (this.postPriceList[i].quotedPriceTax * 1 + 1)).toFixed(2));

    this.postPriceList[i].freightPrice =
      Number((this.postPriceList[i].freightQuotedPrice / (1 + 1 * this.postPriceList[i].freightQuotedTax)).toFixed(2));

    this.postPriceList[i].quotedPrice =
      Number((this.postPriceList[i].offerPrice + this.postPriceList[i].freightQuotedPrice).toFixed(2));
  }

  // 绑定“是否两票制”开关
  IsOneVote(index: number) {
    if (!this.postPriceList[index].isOneVote) {
      this.postPriceList[index].freightQuotedPrice = 0;
    }
    this.bindPrice(index);
  }

  getCategoryFirName() {
    this.dao.doPostRequest(this.SHPurchase.PurchaseFirByCode, this.data.category).subscribe((res: any) => {
      // //console.log(res.data.categoryFirName);
      this.data.category = res.data.categoryFirName;
    }, (err: any) => {
      console.log(err);
      this.isSpinning = false;
      // this.message.create('warning', err.error.message);
    });
  }

  Ranking() {
    const that = this;
    that.getRanking();
    // 未截止
    if (that.data.isSuccess === 1) {
      that.countDown3 = setInterval(() => {
        if (that.isVisible === true) {
          that.getRanking();
        }
      }, 10000);
    }
  }

  getRanking() {
    const that = this;
    that.isSpinning = true;
    const historyPostData = {
      queryWhere: [
        {
          fieldName: 'projectID',
          operator: 'Equal',
          fieldValue: that.bizId
        }
      ],
    };
    const rankingPostData = {
      projectID: that.bizId,
    };
    // 获取历史出价
    that.dao.doPostRequest(that.SHPurchase.PurchaseBidSupHistory, historyPostData).subscribe((res: any) => {
      that.historyPriceList = [];
      let i: number; i = 0;
      for (i; i < res.data.totalCount; i++) {
        if (res.data.dataList[i].offerTime === res.data.totalCount / that.data.contentDtos.length) {
          that.historyPriceList.push(res.data.dataList[i]);
        }
      }
      // console.log(that.historyPriceList);

      {  // 获取当前排名
        that.dao.doPostRequest(that.SHPurchase.PurchaseBidRanking, rankingPostData).subscribe((res1: any) => {
          that.rankingList = res1.data;
          that.isSpinning = false;
          that.isVisible = true;
          // console.log(that.rankingList);
          let j: number; j = 0;
          that.showList = [];

          if (that.historyPriceList.length !== 0) {  // 封装弹窗数据
            for (j; j < that.rankingList.length; j++) {
              that.showList.push({
                productName: that.rankingList[j].productName,
                specifications: that.rankingList[j].specifications,
                ranking: that.rankingList[j].ranking,

                price:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).price * 1).toFixed(2) + '元',   // 税前材料价
                quotedPriceTax:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).quotedPriceTax * 100).toFixed(2) + '%',   // 材料税率
                offerPrice:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).offerPrice * 1).toFixed(2) + '元',   // 税后材料价

                freightPrice:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).freightPrice * 1).toFixed(2) + '元',   // 税前运费
                freightQuotedTax:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).freightQuotedTax * 100).toFixed(2) + '%',   // 运费税率
                freightQuotedPrice:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).freightQuotedPrice * 1).toFixed(2) + '元',   // 税后运费

                quotedPrice:
                  (that.getItem(that.historyPriceList, that.rankingList[j].biddingId).quotedPrice * 1).toFixed(2) + '元',   // 税后总单价
                settlement: that.getItem(that.historyPriceList, that.rankingList[j].biddingId).settlement   // 结算方式
              });
            }
            // that.showRanking();
          } else {
            clearInterval(this.countDown3);
            that.isVisible = false;
            that.message.create('warning', '您未参与此项目！');
          }

          // console.log(this.showList);
        }, (err1: any) => {
          console.log(err1);
          that.isSpinning = false;
        });
      }

    }, (err: any) => {
      console.log(err);
      that.isSpinning = false;
    });
  }

  getItem(arr: any, id: string) {
    let i: number; i = 0;
    for (i; i < arr.length; i++) {
      if (arr[i].biddingId === id) {
        return arr[i];
      }
    }
  }

  getTIME() {
    const that = this;
    const postData = {
      queryFields: '',
      queryWhere: [
        {
          fieldName: 'bizId',
          operator: 'Equal',
          fieldValue: that.bizId
        }
      ],
      queryOrder: '',
      pageIndex: 0,
      pageSize: 0
    };

    this.countDown2 = setInterval(() => {

      that.dao.doPostRequest(that.SHPurchase.PurchaseBidSearchSup, postData).subscribe((res: any) => {

        // 更新finalTime、isSuccess
        that.data.finalTime = res.data.dataList[0].finalTime;
        that.data.isSuccess = res.data.dataList[0].isSuccess;
        that.isSpinning = false;

      }, (err: any) => {
        that.isSpinning = false;
        // that.message.create('warning', err.error.message);
      });

    }, 5000);    // 每5秒刷新finalTime、isSuccess

  }

  cancel() {
    this.isVisible = false;
  }

  cancel2() {
    this.isVisiblePdf = false;
    this.router.navigateByUrl('/index');
  }

  cancel3() {
    this.isVisiblePdf2 = false;
  }

  agree() {
    this.isVisiblePdf = false;
  }

  showPdf() {
    this.isVisiblePdf2 = true;
  }

  // 提交出价
  postPrice() {
    this.isSpinning = true;

    let postData: any; postData = [];
    let i: number; i = 0;
    for (i; i < this.postPriceList.length; i++) {
      postData.push({
        supplierCode: this.postPriceList[i].supplierCode,
        projectID: this.postPriceList[i].projectID,
        biddingId: this.postPriceList[i].biddingId,
        quotedPrice: this.postPriceList[i].quotedPrice,   // 总价

        quotedPriceTax: this.postPriceList[i].quotedPriceTax,
        offerPrice: this.postPriceList[i].offerPrice,    // 材料税后价
        price: this.postPriceList[i].price,     // 报价裸价

        freightQuotedPrice: this.postPriceList[i].freightQuotedPrice,         // 运费税后
        freightQuotedTax: this.postPriceList[i].freightQuotedTax,         // 运费税率
        freightPrice: this.postPriceList[i].freightPrice,         // 运费单价

        settlement: this.postPriceList[i].settlement,     // 结算方式
        isOneVote: this.postPriceList[i].isOneVote ? 2 : 1,       // 是否两票制
        otherPrice: 0
      });
    }

    // console.log(postData);

    this.dao.doPostRequest(this.SHPurchase.PurchaseBidOffer, postData).subscribe((res: any) => {

      this.isSpinning = false;

    }, (err: any) => {
      this.isSpinning = false;
      alert(err.error.message);
      console.log(err);
    });
  }

  toResult() {
    this.router.navigate(['result/info', this.bizId]);
  }

  download() {

    const $form = $('<form method="GET" target="_blank"></form>');

    $form.attr('action', this.pdfSrc);

    $form.appendTo($('body'));

    $form.submit();

    // window.open(this.pdfSrc);

  }

}
