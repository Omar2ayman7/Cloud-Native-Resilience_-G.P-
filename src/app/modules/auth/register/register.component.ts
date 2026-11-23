import { Component, inject } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm:FormGroup = new FormGroup({
    name : new FormControl(null , [Validators.required , Validators.minLength(2) , Validators.maxLength(20) ]),
    email : new FormControl(null , [Validators.required , Validators.email ]), 
    password : new FormControl(null , [Validators.required , Validators.pattern(/^\w{6,}$/) ]),
    rePassword : new FormControl(null , [Validators.required  , Validators.pattern(/^\w{6,}$/) ]),
    phone : new FormControl(null , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/) ])
  } , {validators:[this.confirmPassword]})

  confirmPassword(group:AbstractControl){
    return  group.get('password')?.value === group.get('rePassword')?.value ? null : {mismatch : true}
  }

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  msgError : string = ''

  isloading : boolean = false;

  submitForm():void {
    if(this.registerForm.valid){
      console.log(this.registerForm.value)
      this.isloading = true;
      this.authService.registerUsers(this.registerForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          if(res.message === 'success'){
            this.router.navigate(['/login'])
          }
          this.isloading = false;
        },
        error:(err)=>{
          console.log(err.error.message)
          this.msgError = err.error.message
          this.isloading = false;
        }
      })
    }

  }
}
