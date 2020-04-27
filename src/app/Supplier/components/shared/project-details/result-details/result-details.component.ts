import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { ColDef } from 'ag-grid-community';
import { DaoService, SHPurchaseSettinggService } from 'src/app/core';
import { ResultPrice } from 'src/app/Supplier/domains/result.domain';
import { ProductInfo } from 'src/app/Supplier/domains/product.domain';

@Component({
  selector: 'app-result-details',
  templateUrl: './result-details.component.html',
  styleUrls: ['./result-details.component.scss']
})
export class ResultDetailsComponent implements OnInit {

  bizId: string = null;
  isSpinning = false;
  resultPrice: ResultPrice[][] = [];
  productInfoList: ProductInfo[][] = [];
  Form1: any = {};
  resultList: any = [];

  productColumnDefs: ColDef[] = [
    // { headerCheckboxSelection: true, checkboxSelection: true, width: 40 },
    { headerName: '材料名称', field: 'producName', sortable: true, filter: true, resizable: true, width: 210 },
    { headerName: '规格/型号', field: 'specifications', sortable: true, filter: true, resizable: true, width: 210 },
    { headerName: '计量单位', field: 'metering', sortable: true, filter: true, resizable: true, width: 210 },
    // { headerName: '送货允许误差', field: 'errorLimit', sortable: true, filter: true, resizable: true, width: 210 },
    { headerName: '购买数量', field: 'purchaseNum', sortable: true, filter: true, resizable: true, width: 210 },
    { headerName: '备注', field: 'remark', sortable: true, filter: true, resizable: true, width: 210 },
  ];

  priceColumnDefs: ColDef[] = [
    // { headerCheckboxSelection: true, checkboxSelection: true, width: 40 },
    // { headerName: '排名', field: 'ranking', sortable: true, filter: true, resizable: true, width: 70 },
    { headerName: '供应商名称', field: 'supplierName', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '税后总报价', field: 'quotedPrice', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '税后材料报价', field: 'offerPrice', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '材料税率', field: 'quotedPriceTax', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '税前材料报价', field: 'price', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '票制', field: 'isOneVote', sortable: true, filter: true, resizable: true, width: 70 },
    { headerName: '税后运费', field: 'freightQuotedPrice', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '运费税率', field: 'freightQuotedTax', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '税前运费', field: 'freightPrice', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '结算方式', field: 'settlement', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '分配量', field: 'distributionNum', sortable: true, filter: true, resizable: true, width: 120 },
    { headerName: '总金额', field: 'amountMoney', sortable: true, filter: true, resizable: true, width: 120 },
  ];

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private message: NzMessageService,
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService
  ) { }

  ngOnInit() {
    this.isSpinning = true;
    this.activatedRoute.paramMap.subscribe((params: any) => {
      this.bizId = params.get('bizId');
      const postData = {
        queryWhere: [
          {
            fieldName: 'bizId',
            operator: 'Equal',
            fieldValue: this.bizId
          }
        ],
      };
      const postData1 = {
        queryWhere: [
          {
            fieldName: 'projectID',
            operator: 'Equal',
            fieldValue: this.bizId
          }
        ],
      };
      this.dao.doPostRequest(this.SHPurchase.PurchaseBidSearchSup, postData).subscribe((res: any) => {
        this.Form1 = res.data.dataList[0];
        this.Form1.seedGoodsTime = this.Form1.seedGoodsTime.substring(0, 10);
        if (this.Form1.totalAmount !== null) {
          this.Form1.totalAmount = Number(this.Form1.totalAmount).toFixed(2).toString();
        }
        this.getCategoryFirName();

        this.dao.doPostRequest(this.SHPurchase.PurchaseGetResultSup, postData1).subscribe((res1: any) => {
          this.resultList = res1.data.dataList;
          this.productInfoList = [];
          this.resultPrice = [];
          this.isSpinning = false;
          // 加载产品grid数据  productInfoList
          for (let i = 0; i < this.Form1.contentDtos.length; i++) {
            // 产品采购内容   productInfoList[i]为第i+1条采购内容
            this.productInfoList.push([]);
            this.resultPrice.push([]);
            this.productInfoList[i].push({
              producName: this.getProduct(this.Form1.contentDtos[i].bizId, 1),
              specifications: this.getProduct(this.Form1.contentDtos[i].bizId, 2),
              metering: this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              purchaseNum: Number(this.getProduct(this.Form1.contentDtos[i].bizId, 5)).toFixed(2).toString()
                + ' ' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              remark: this.getProduct(this.Form1.contentDtos[i].bizId, 6),
              // pcId: this.Form1.contentDtos[i].bizId
            });
            this.resultPrice[i].push({
              supplierName: this.getPriceData(this.Form1.contentDtos[i].bizId).supplierName,
              isOneVote: this.getPriceData(this.Form1.contentDtos[i].bizId).isOneVote,
              price: this.getPriceData(this.Form1.contentDtos[i].bizId).price.toFixed(2).toString()
                + ' 元/' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              quotedPriceTax: (this.getPriceData(this.Form1.contentDtos[i].bizId).quotedPriceTax * 100).toFixed(2).toString() + ' %',
              quotedPrice: this.getPriceData(this.Form1.contentDtos[i].bizId).quotedPrice.toFixed(2).toString()
                + ' 元/' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              distributionNum: this.getPriceData(this.Form1.contentDtos[i].bizId).distributionNum.toFixed(2).toString()
                + ' ' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              amountMoney: this.getPriceData(this.Form1.contentDtos[i].bizId).amountMoney.toFixed(2).toString() + ' 元',
              settlement: this.getPriceData(this.Form1.contentDtos[i].bizId).settlement,
              freightPrice: this.getPriceData(this.Form1.contentDtos[i].bizId).freightPrice.toFixed(2).toString()
                + ' 元/' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              offerPrice: this.getPriceData(this.Form1.contentDtos[i].bizId).offerPrice.toFixed(2).toString()
                + ' 元/' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              freightQuotedPrice: this.getPriceData(this.Form1.contentDtos[i].bizId).freightQuotedPrice.toFixed(2).toString()
                + ' 元/' + this.getProduct(this.Form1.contentDtos[i].bizId, 3),
              freightQuotedTax: (this.getPriceData(this.Form1.contentDtos[i].bizId).freightQuotedTax * 100).toFixed(2).toString() + ' %',
            });
          }
          // console.log(this.productInfoList);
          // console.log(this.resultPrice);
        }, (err1: any) => {
          this.isSpinning = false;
          console.log(err1);
        });
      }, (err: any) => {
        this.isSpinning = false;
        console.log(err);
      });
    });
  }

  // 获取组织长名
  getCategoryFirName() {
    this.dao.doPostRequest(this.SHPurchase.PurchaseFirByCode, this.Form1.category).subscribe((res: any) => {
      this.Form1.category = res.data.categoryFirName;
    }, (err: any) => {
      console.log(err);
      this.isSpinning = false;
    });
  }

  // 获取采购内容contentDtos属性
  getProduct(bcId: string, field: number): string {
    let i: number;
    i = 0;
    for (i; i < this.Form1.contentDtos.length; i++) {
      if (bcId === this.Form1.contentDtos[i].bizId) {
        if (field === 1) {
          return this.Form1.contentDtos[i].productName;
        }
        if (field === 2) {
          return this.Form1.contentDtos[i].specifications;
        }
        if (field === 3) {
          return this.Form1.contentDtos[i].metering;
        }
        // if (field === 4) {
        //   return this.Form1.contentDtos[i].errorLimit;
        // }
        if (field === 5) {
          return this.Form1.contentDtos[i].purchaseNum;
        }
        if (field === 6) {
          return this.Form1.contentDtos[i].remark;
        }
        if (field === 7) {
          return this.Form1.contentDtos[i].bizId;
        }
      }
    }
  }

  getPriceData(bcid: string): any {
    let i: number; i = 0;
    for (i; i < this.resultList.length; i++) {
      if (bcid === this.resultList[i].bcId) {
        return this.resultList[i];
      }
    }
  }

}
