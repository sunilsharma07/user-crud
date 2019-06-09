import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn } from '@angular/forms';

import { MemberService } from '../../../services/member.service';

import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  
  subSendForm: FormGroup;
  isSubmitted: Boolean = false;
  isDataLoading: Boolean = false;
  public btnDisabled = false;
  resData: any;
  //type: string;
  user_cate_dropdown:any;
  user_category_list : any;
  currrentUserData  :any;
  returnRes:any;
  imagess_name = [];
  images_y:any = []; 
  all_files:any = [];
  all_files_post:any;
  subAdminData: any;
  subcateId: string;
  subAdminForm: FormGroup;
  


  constructor(
    private fb: FormBuilder,
    private PuzzlecategoryService: MemberService,
    public bsModalRef: BsModalRef,
    private toastrService: ToastrService

  ) {
    
    this.subSendForm = fb.group({
      cate_name : ['', [Validators.required]],
      cate_status:['', [Validators.required]],
    });

   }


  ngOnInit() 
  {
        this.subSendForm.patchValue({
          cate_name: this.subAdminData.name.trim(),
          cate_status: this.subAdminData.status,
        });

      this.subcateId = this.subAdminData._id;
     
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
            name: this.subSendForm.value.cate_name,
            status: this.subSendForm.value.cate_status,
            member_id:this.subcateId
           };

       
         let api_name = 'edit_member';
      
          this.PuzzlecategoryService
          .past_data_to_server(api_name,reqParams)
          .subscribe(
              response => {
                  this.isDataLoading = false;
                  this.btnDisabled = false;
                  this.resData = response;
                  this.returnRes = { success: true, message: this.resData.message };
                  this.toastrService.success(this.resData.message,'Member Update');
                  this.bsModalRef.hide();
                  this.bsModalRef.content.type = "edit";

              }, err => {
                  this.btnDisabled = false;
                  this.toastrService.error("", err.error.message);
              });

      }

  }
  
  onCancel() 
  {
      this.bsModalRef.hide();
  }


}
