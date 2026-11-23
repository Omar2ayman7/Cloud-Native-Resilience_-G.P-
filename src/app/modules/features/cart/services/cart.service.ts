import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly httpClient = inject(HttpClient)
  private readonly cookieService = inject(CookieService)

  // myHeaders:object = {
  //       headers:{
  //         token : this.cookieService.get('token')
  //       }
  //     };


  cartOfItem(id : string):Observable<any>{
    return this.httpClient.post(environment.baseUrl + 'cart', 
      {
          "productId": id
      },
    )
  }


  getLoggedCart():Observable<any>{
    return this.httpClient.get(environment.baseUrl + 'cart',
    )
  }



  removeItem(id: string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `cart/${id}`,
    )
  }

  updateCount(id: string, count: number):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `cart/${id}`,
      {
        "count": count,
      },

    )
  }


  checkOutSession(id:string | null, data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `orders/checkout-session/${id}?url=http://localhost:4200`,
      data
    )
  }

  getOrdesr(id : string):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `orders/user/${id}`)
  }


}
