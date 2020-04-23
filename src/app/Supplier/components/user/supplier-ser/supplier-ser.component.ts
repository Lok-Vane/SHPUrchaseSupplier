import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DaoService, SHPurchaseSettinggService } from 'src/app/core';
import { ColDef } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd';
import { AgGridAngular } from 'ag-grid-angular';
import { SupService } from 'src/app/Supplier';

@Component({
  selector: 'app-supplier-ser',
  templateUrl: './supplier-ser.component.html',
  styleUrls: ['./supplier-ser.component.scss']
})
export class SupplierSerComponent implements OnInit {

  @ViewChild('ServicesAgrid', { static: true }) ServicesAgrid: AgGridAngular;
  isSpinning = false;
  serviceList: SupService[] = [];
  ind = 1;
  totalCount = 0;

  columnDefsSup: ColDef[] = [
    { headerCheckboxSelection: true, checkboxSelection: true, width: 40 },
    { headerName: '供应商名称', field: 'supplierName', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: '供应料品类别', field: 'oneCategoryName', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: '供应组织名称', field: 'orgName', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: '供应组织简称', field: 'orgSName', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: '备注', field: 'remark', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: '创建人', field: 'createdByName', sortable: true, filter: true, resizable: true, width: 200 },
    { headerName: '创建时间', field: 'createdTime', sortable: true, filter: true, resizable: true, width: 200 },
  ];
  categoryFirstList: any = [];
  orgList: any = [];
  visible = false;
  selectCategory: any = null;
  selectOrg: Array<any> = null;

  constructor(
    public dao: DaoService,
    public SHPurchase: SHPurchaseSettinggService,
    private message: NzMessageService,
    private eleRef: ElementRef
  ) { }

  ngOnInit() {
    this.searchServicesList(10, 1);
  }

  searchServicesList(pageSize: number, pageIndex: number) {
    this.isSpinning = true;
    const postData = {
      queryFields: '',
      queryOrder: 'oneCategoryName,orgSName',
      queryWhere: [
        {
          fieldName: 'code',
          fieldValue: 'SP1584283308',
          operator: 'Equal',
        },
        {
          fieldName: 'state',
          fieldValue: 1,
          operator: 'Equal',
        }
      ],
      pageSize,
      pageIndex
    };
    this.dao.doPostRequest(this.SHPurchase.PurchaseSerSearchSup, postData).subscribe((res: any) => {
      this.isSpinning = false;
      this.serviceList = res.data.dataList;
      this.totalCount = res.data.totalCount;
    }, (err: any) => {
      this.isSpinning = false;
    });
  }

  IndexChange() {
    setTimeout(() => {
      this.searchServicesList(10, this.ind);
    }, 100);
  }

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
      this.isSpinning = false;
    }, (err: any) => {
      console.log(err);
      this.isSpinning = false;
    });
  }

  FindOrgList(pageSize: number, pageIndex: number) {
    this.isSpinning = true;

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
    this.dao.doPostRequest(this.SHPurchase.OrgSearch, postData).subscribe((res: any) => {
      this.isSpinning = false;
      this.orgList = res.data.dataList;
    }, (err: any) => {
      console.log(err);
      this.isSpinning = false;
    });
  }

  showAdd() {
    this.visible = true;
    this.FindCategoryFirst(0, 0);
    this.FindOrgList(0, 0);
  }

  close() {
    this.visible = false;
  }

  doAdd() {
    this.isSpinning = true;
    let i: number; i = 0;
    let orgTemp: any; orgTemp = [];
    for (i; i < this.selectOrg.length; i++) {
      orgTemp.push({
        orgCode: this.selectOrg[i].code,
        orgId: this.selectOrg[i].bizId,
        orgName: this.selectOrg[i].name,
        orgSName: this.selectOrg[i].shortName,
      });
    }
    const postData = {
      code: JSON.parse(sessionStorage.getItem('supLogin')).supplierCode,
      supplierName: JSON.parse(sessionStorage.getItem('supLogin')).supplierName,
      oneCategoryCode: this.selectCategory.code,
      oneCategoryId: this.selectCategory.bizId,
      oneCategoryName: this.selectCategory.categoryFirName,
      orgInfos: orgTemp
    };
    console.log(postData);
    this.dao.doPostRequest(this.SHPurchase.PurchaseSerCreate, postData).subscribe((res: any) => {
      this.isSpinning = false;
      this.selectCategory = null;
      this.selectOrg = null;
      this.visible = false;
      this.searchServicesList(10, 1);
    }, (err: any) => {
      this.isSpinning = false;
    });
  }

  cancel() {

  }

  doDelete() {
    this.isSpinning = true;
    const selectedNodes = this.ServicesAgrid.api.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    if (selectedData.length === 0) {
      this.isSpinning = false;
      this.message.create('warning', '至少选定一条数据！');
    } else {
      let postData: any; postData = [];
      let i: number; i = 0;
      for (i; i < selectedData.length; i++) {
        postData.push({
          bizId: selectedData[i].bizId,
          code: selectedData[i].code,
        });
      }
      if (selectedData.length === 1) {
        this.dao.doPostRequest(this.SHPurchase.PurchaseSerDelete, postData[0]).subscribe((res: any) => {
          this.isSpinning = false;
          this.searchServicesList(10, 1);
        }, (err: any) => {
          this.isSpinning = false;
        });
      } else {
        this.dao.doPostRequest(this.SHPurchase.PurchaseSerBatchDelete, postData).subscribe((res: any) => {
          this.isSpinning = false;
          this.searchServicesList(10, 1);
        }, (err: any) => {
          this.isSpinning = false;
        });
      }
    }
  }

}
