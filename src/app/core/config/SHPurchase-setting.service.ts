import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SHPurchaseSettinggService {
    public readonly orgApiToken = '77f1753bbbbd4366ada57d6988444db3';
    public readonly baseUrl = '/api/shepp/v1';  // http://172.16.100.29:8087
    public readonly baseUrlOrg = '/api/sys/v1';  // http://172.16.100.29:8001

    public readonly OrgSearch = `${this.baseUrlOrg}/organize/search`;  // 查询组织

    public readonly PurchaseFirSearch = `${this.baseUrl}/categoryclassifiyfirst/search`;  // 查询一级分类
    public readonly PurchaseFirCreate = `${this.baseUrl}/categoryclassifiyfirst/create`;  // 创建一级分类
    public readonly PurchaseFirModify = `${this.baseUrl}/categoryclassifiyfirst/modify`;  // 修改一级分类
    public readonly PurchaseFirDelete = `${this.baseUrl}/categoryclassifiyfirst/delete`;  // 修改一级分类
    public readonly PurchaseFirByCode = `${this.baseUrl}/categoryclassifiyfirst/findbycode`;  // 查询一级分类 code

    public readonly PurchaseSecSearch = `${this.baseUrl}/categoryclassifiysecond/search`;  // 查询二级分类
    public readonly PurchaseSecCreate = `${this.baseUrl}/categoryclassifiysecond/create`;  // 创建二级分类
    public readonly PurchaseSecModify = `${this.baseUrl}/categoryclassifiysecond/modify`;  // 修改二级分类
    public readonly PurchaseSecDelete = `${this.baseUrl}/categoryclassifiysecond/delete`;  // 删除二级分类
    public readonly PurchaseSecByCode = `${this.baseUrl}/categoryclassifiysecond/findbycode`;  // 查询二级分类 code

    public readonly PurchaseProSearch = `${this.baseUrl}/product/search`;  // 查询产品档案
    public readonly PurchaseProCreate = `${this.baseUrl}/product/create`;  // 创建产品档案
    public readonly PurchaseProModify = `${this.baseUrl}/product/modify`;  // 修改产品档案
    public readonly PurchaseProDelete = `${this.baseUrl}/product/delete`;  // 删除产品档案
    public readonly PurchaseProByCode = `${this.baseUrl}/product/findbycode`;  // 查询产品档案 code

    public readonly PurchaseSupCreate = `${this.baseUrl}/supplierinfo/create`;  // 创建供应商账号
    public readonly PurchaseSupSearch = `${this.baseUrl}/supplierinfo/search`;  // 查询供应商账号
    public readonly PurchaseSupByCode = `${this.baseUrl}/supplierinfo/findbycode`;  // 查询供应商账号 code
    public readonly PurchaseSupLogin = `${this.baseUrl}/supplierinfo/suplogin`;  // 供应商登录
    public readonly PurchaseSupModifyPsw = `${this.baseUrl}/supplierinfo/modifypassword`;  // 供应商修改密码

    public readonly PurchaseNoticeSearch = `${this.baseUrl}/notice/search`;  // 查询公告
    public readonly PurchaseBidSearch = `${this.baseUrl}/biddingproject/search`;  // 招标项目详情 内部
    public readonly PurchaseBidSearchSup = `${this.baseUrl}/biddingproject/suppliersearch`;  // 招标项目详情 供应商
    public readonly PurchaseBidModify = `${this.baseUrl}/biddingproject/modify`;  // 招标项目修改 内部
    public readonly PurchaseBidCreate = `${this.baseUrl}/biddingproject/create`;  // 招标项目创建 内部

    public readonly PurchaseDicSearch = `${this.baseUrl}/dictionary/search`;  // 数据字典查询
    public readonly PurchaseDicCreate = `${this.baseUrl}/dictionary/create`;  // 数据字典创建
    public readonly PurchaseDicModify = `${this.baseUrl}/dictionary/modify`;  // 数据字典修改
    public readonly PurchaseDicDelete = `${this.baseUrl}/dictionary/delete`;  // 数据字典删除
    public readonly PurchaseDicByCode = `${this.baseUrl}/dictionary/findbycode`;  // 数据字典查询 code

    public readonly PurchaseProjCount = `${this.baseUrl}/partproject/getcount`;  // 获取出价人数
    public readonly PurchaseProjSupPar = `${this.baseUrl}/partproject/suppliersearch`;  // 获取供应商已参与项目

    public readonly PurchaseGetResult = `${this.baseUrl}/bcdistribution/getresult`;  // 获取项目竞价结果 内部
    public readonly PurchaseGetResultSup = `${this.baseUrl}/bcdistribution/suppliersearch`;  // 获取项目竞价结果 供应商

    public readonly PurchaseBidOffer = `${this.baseUrl}/biddingoffer/create`;  // 供应商新增报价
    public readonly PurchaseBidRanking = `${this.baseUrl}/biddingoffer/ranking`;  // 供应商获取最新排名
    public readonly PurchaseBidSupHistory = `${this.baseUrl}/biddingoffer/suppliersearch`;  // 供应商查询历史报价

    public readonly PurchaseSerCreate = `${this.baseUrl}/supplierservices/create`;  // 供应商创建供应关系
    public readonly PurchaseSerBatchDelete = `${this.baseUrl}/supplierservices/batchdelete`;  // 供应商批量删除供应关系
    public readonly PurchaseSerDelete = `${this.baseUrl}/supplierservices/delete`;  // 供应商删除供应关系
    public readonly PurchaseSerSearchSup = `${this.baseUrl}/supplierservices/suppliersearch`;  // 供应商查询供应关系
    public readonly PurchaseSupServicesSearch = `${this.baseUrl}/supplierservices/search`;  // 内部查询供应商供应关系

}
