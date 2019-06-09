import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { PaginationModule } from 'ngx-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { TaskComponent } from './task.component';
import { TaskRoutingModule } from './task-routing.module'; 


const routes: Routes = [
  {
    path: '',
    component: TaskComponent,
    data: { 'title': '' }
  }
];

@NgModule({
  imports: [
    FormsModule,
    DataTablesModule,
    HttpClientModule,
    TaskRoutingModule,
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
  declarations: [ TaskComponent ],  
  exports: [RouterModule]
})
export class TaskModule { }
