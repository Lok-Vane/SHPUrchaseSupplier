import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  SupplierindComponent,
  TenderingComponent,
  ProjectDetailsComponent,
  ResultDetailsComponent,
  SearchInfoComponent,
  SupplierSerComponent,
  MyProjectComponent,
} from '.';


const routes: Routes = [
  { path: 'index', component: SupplierindComponent },
  { path: 'tendering', component: TenderingComponent },
  { path: 'project/info/:bizId', component: ProjectDetailsComponent },
  { path: 'result/info/:bizId', component: ResultDetailsComponent },
  { path: 'search/:key', component: SearchInfoComponent },
  { path: 'user/myPro/:Code', component: MyProjectComponent },
  { path: 'user/myServices/:Code', component: SupplierSerComponent },
  { path: '**', redirectTo: 'index' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
