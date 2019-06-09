import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
//import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';


// import { DataTablesModule } from 'angular-datatables';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule
} from 'ngx-toastr';
import { PaginationModule } from 'ngx-bootstrap';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

import { AuthenticationService } from './services/authentication.service';
//import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptor } from './policy/token.interceptor';


import { MemberService } from './services/member.service';
import { TaskService } from './services/task.service';
import { CustomHttp } from './services/custom-http';
import { AuthGuard } from './services/authGuard';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';


// Datepicker Module
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ChartsModule } from 'ng2-charts/ng2-charts';
//import { SweetAlertService } from 'ngx-sweetalert2';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



import { AddComponent } from './views/member/addpopup/add.component';
import { EditComponent } from './views/member/editpopup/edit.component';

import { AddtaskpopupComponent } from './views/task/addtaskpopup/addtaskpopup.component';
import { EdittaskpopupComponent } from './views/task/edittaskpopup/edittaskpopup.component';



@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    SweetAlert2Module.forRoot(
      {
        buttonsStyling: false,
        customClass: 'modal-content',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn'
    }
    ),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,   

    AddComponent,
    EditComponent,
    AddtaskpopupComponent,
    EdittaskpopupComponent,
  ],
  providers: [{
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  HttpClient,
  AuthGuard,
  AuthenticationService,
  MemberService,
  TaskService,
  CustomHttp
  ],
  entryComponents:[
    AddComponent,
    EditComponent,
    AddtaskpopupComponent,
    EdittaskpopupComponent,
  ],  
  bootstrap: [ AppComponent ],
  exports: [
    SweetAlert2Module,
    PaginationModule,
    BsDatepickerModule    
  ],
})
export class AppModule { }
