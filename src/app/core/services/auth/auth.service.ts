import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)
  private readonly router = inject(Router)


  registerUsers(data:object):Observable <any> {

    return this.httpClient.post(environment.baseUrl + 'auth/signup' , data)
  }
  loginUsers(data:object):Observable <any> {

    return this.httpClient.post(environment.baseUrl + 'auth/signin' , data)
  }


  logOut():void{
    this.cookieService.delete('token')
    this.router.navigate(['/login'])
  }


  decodedToken(){
    let token;
    try {

      token = jwtDecode(this.cookieService.get('token'))

    } catch (error) {
      this.logOut
    }
    
    return token
  }


}
