import { Component, inject } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms'
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // loginForm:FormGroup = new FormGroup({
  //   email : new FormControl(null , [Validators.required , Validators.email ]), 
  //   password : new FormControl(null , [Validators.required , Validators.pattern(/^\w{6,}$/) ])
  // })

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly cookieService = inject(CookieService)
  private readonly fb = inject(FormBuilder)


  loginForm:FormGroup = this.fb.group({
    email: [null, [Validators.required , Validators.email ]],
    password: [null, [Validators.required , Validators.pattern(/^\w{6,}$/) ]]
  })


  msgError : string = ''

  isloading : boolean = false;


  submitForm():void {
    if(this.loginForm.valid){
      console.log(this.loginForm.value)

      this.isloading = true

      this.authService.loginUsers(this.loginForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          if(res.message === 'success'){

            this.cookieService.set('token',res.token)

            this.authService.decodedToken()

            this.router.navigate(['/home'])
          }

          this.isloading = false

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
