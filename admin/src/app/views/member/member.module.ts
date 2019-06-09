import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { PaginationModule } from 'ngx-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


import { MemberComponent } from './member.component';
import { MemberRoutingModule } from './member-routing.module'; 




const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    data: { 'title': '' }
  }
];

@NgModule({
  imports: [
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    MemberRoutingModule,
    CommonModule,
    PaginationModule.forRoot(),
    SweetAlert2Module.forRoot(
      {
        buttonsStyling: false,
        customClass: 'modal-content',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn'
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [ MemberComponent ],  
  exports: [RouterModule]
})
export class MemberModule { }
