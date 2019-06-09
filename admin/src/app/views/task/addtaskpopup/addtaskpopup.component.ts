import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, ValidatorFn } from '@angular/forms';

import { MemberService } from '../../../services/member.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-addtaskpopup',
  templateUrl: './addtaskpopup.component.html',
  styleUrls: ['./addtaskpopup.component.scss']
})
export class AddtaskpopupComponent implements OnInit {
  
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
  puzzle_category_list : any;
  


  constructor(
    private fb: FormBuilder,
    private PuzzlecategoryService: MemberService,
    public bsModalRef: BsModalRef,
    private toastrService: ToastrService

  ) {
    
    this.subSendForm = fb.group({
     puzzle_category : ['', [Validators.required]], 
      cate_name : ['', [Validators.required]],
      cate_status:['', [Validators.required]],
    });

   }


  ngOnInit() 
  {
    this.subSendForm.patchValue({
      cate_status: 1,
    });

    this.get_member_dropdown_list();
     
  }

  get_member_dropdown_list(){
    
     let api_name = 'list_member_dropdown';

       let reqParams = {      
           option: 1,
           added_by:localStorage.user_id,
       };

        this.PuzzlecategoryService.past_data_to_server(api_name,reqParams).subscribe(response => 
          {
              this.resData = response;
              this.puzzle_category_list = this.resData.data;

        }, error => {          
            this.toastrService.error('', error.error.message);
        });


  }



  onSubmit()
  {
    this.isSubmitted = true;

      if(this.subSendForm.valid) 
      {
        this.btnDisabled = true;
        this.isDataLoading = true;
        this.toastrService.clear();
          
          const reqParams = {      
            name: this.subSendForm.value.cate_name,
            status: this.subSendForm.value.cate_status,
            added_by : localStorage.user_id,
            member_id : this.subSendForm.value.puzzle_category,
            task_status:0
           };

          let api_name = 'add_task';

      
          this.PuzzlecategoryService
          .past_data_to_server(api_name,reqParams)
          .subscribe(
              response => {
                  this.isDataLoading = false;
                  this.btnDisabled = false;
                  this.resData = response;
                  this.returnRes = { success: true, message: this.resData.message };
                  this.toastrService.success(this.resData.message,'Task Add');
                  this.bsModalRef.hide();
                  this.bsModalRef.content.type = "success";

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
