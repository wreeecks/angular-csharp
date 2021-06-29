import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_model/member';
import { Pagination } from 'src/app/_model/pagination';
import { User } from 'src/app/_model/user';
import { UserParams } from 'src/app/_model/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {
  members!: Member[];
  pagination!: Pagination;
  userParams!: UserParams;
  user!: User;
  genderList: {[key: string] : string}[] = [{value: "male", label: "Male"},{value: "female", label: "Female"}]
 
  constructor(private memberService: MembersService) { 
    this.userParams = memberService.getUserParams()
  }

  ngOnInit(): void {
   this.loadMembers();
  }

  loadMembers()
  {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.members = response.results;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.loadMembers();
  }

  resetFilter(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
}
