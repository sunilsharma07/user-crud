import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { PuzzlecategoryComponent } from './puzzlecategory.component';

import { MemberComponent } from './member.component';


const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    data: {
      title: 'Member List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberRoutingModule {}


