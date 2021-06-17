import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister  = new EventEmitter();
  
  model: any = {};
  registrationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService, private router: Router ) { }

  ngOnInit(): void {
    
  }

  register(){
    this.accountService.register(this.model).subscribe(
      response => { 
        this.router.navigateByUrl('/members');
      },
      error => {
        this.registrationErrors = error;
      }
    );
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
