import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  SupplierindComponent,
  SupplierComponent,
  EndComponent,
  SearchComponent,
  ParticipationNoticeComponent,
  ResultDetailsComponent,
  ListMyComponent,
  UserComponent,
  LoginComponent,
  ModifyPswComponent,
  MyProjectComponent,
  SupplierSerComponent,
  SupInfoComponent,
  ContentComponent,
  CarouselComponent,
  MenuComponent,
  TenderingComponent,
  InquiryComponent,
  ListComponent,
  ListSearchComponent,
  ProjectDetailsComponent,
  CountdownComponent,
  SearchInfoComponent,
  ModalContentComponent,
} from '.';
import { SupplierRoutingModule } from './Supplier-routing.module';
import { PdfModalComponent } from './components/shared/project-details/pdf-modal/pdf-modal.component';

@NgModule({
  declarations: [
    SupplierComponent,
    SearchComponent,
    EndComponent,
    SupplierindComponent,
    ParticipationNoticeComponent,
    ResultDetailsComponent,
    ListMyComponent,
    UserComponent,
    LoginComponent,
    ModifyPswComponent,
    MyProjectComponent,
    SupplierSerComponent,
    SupInfoComponent,
    ContentComponent,
    CarouselComponent,
    MenuComponent,
    TenderingComponent,
    InquiryComponent,
    ListComponent,
    ListSearchComponent,
    ProjectDetailsComponent,
    CountdownComponent,
    SearchInfoComponent,
    ModalContentComponent,
    PdfModalComponent
  ],
  exports: [SupplierComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    SupplierRoutingModule,
    PdfViewerModule,
    AgGridModule.withComponents([])
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
})
export class SupplierModule { }
