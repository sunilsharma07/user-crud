import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

//import { PuzzlecategoryService } from '../../../services/puzzlecategory.service';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../../services/authentication.service';
//import { BsModalRef } from 'ngx-bootstrap/modal';


import { MustMatch } from '../../helper/must-match.validator';



@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {

  subSendForm: FormGroup;
  isSubmitted: Boolean = false;
  isDataLoading: Boolean = false;
  public btnDisabled = false;
  resData: any;
  //user_cate_dropdown:any;
  //user_category_list : any;
  currrentUserData  :any;
  returnRes:any;
  imagess_name = [];
  images_y:any = []; 
  all_files:any = [];
  all_files_post:any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private AuthenticationService: AuthenticationService,
   // public bsModalRef: BsModalRef,
    private toastrService: ToastrService
  ) {

        this.subSendForm = fb.group({          
          first_name : ['', [Validators.required]],
          last_name : ['', [Validators.required]],
          phone : ['', [Validators.required]],
          email : ['', [Validators.required,Validators.email]],
          password : ['', [Validators.required]],
          cpassword : ['', [Validators.required]],         
        },{
          validator: MustMatch('password', 'cpassword')
        });



   }


  ngOnInit() 
  {
    
     
  }


  onSubmit()
  {    
      
    this.isSubmitted = true;

      if(this.subSendForm.valid) 
      {
        this.btnDisabled = true;
        this.isDataLoading = true;
        this.toastrService.clear();
          
          //console.log(this.subSendForm.value);

          //const forms = new FormData();
          //forms.append('name',this.subSendForm.value.cate_name);
          //forms.append('status',this.subSendForm.value.cate_status);
       

          const reqParams = {      
             first_name: this.subSendForm.value.first_name,
             status: 1,
             last_name: this.subSendForm.value.last_name,
             phone: this.subSendForm.value.phone,
             email: this.subSendForm.value.email,
             password: this.subSendForm.value.password,
           };


          let api_name = 'register_new_user';
      

          this.AuthenticationService.new_user(api_name,reqParams).subscribe(response => {
            this.toastrService.success('Register User successfully', 'Register');

            this.router.navigate(['login']);
            
         }, error => {          
           this.toastrService.error('', error.error.message);
         });


      }

  }
  
  

}
