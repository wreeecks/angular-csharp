import { HttpClient } from '@angular/common/http';
import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registrationForm!: FormGroup;
  registrationErrors: string[] = [];
  maxDate!: Date;

  constructor(private accountService: AccountService, 
    private toastr: ToastrService, 
    private router: Router,
    private fb: FormBuilder 
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm(){
    this.registrationForm = this.fb.group({
      gender:   ['male', Validators.required],
      knownAs:   ['', Validators.required],
      dateOfBirth:   ['', Validators.required],
      city:   ['', Validators.required],
      country:   ['', Validators.required],
      username: ['', Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValue('password')]]
    });
  }

  register(){
    this.accountService.register(this.registrationForm.value).subscribe(
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

  matchValue(matchTo: string): ValidatorFn {
    return (control: AbstractControl) : {[key: string]: any} | null => {
      const forbidden: any = control?.parent?.controls;
      return (forbidden) 
        ? (control?.value === forbidden[matchTo]?.value) ? null : {isMatching: true}
        : null;
    }
  }
}
