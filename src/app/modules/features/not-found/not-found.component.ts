import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-not-found',
  imports: [NavbarComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements OnInit {
  private readonly cookieservice = inject(CookieService)

  navNotFound!: boolean ;

  ngOnInit(): void {
    this.notFound()
  }

  notFound():void{
    if(this.cookieservice.get('token')){
      this.navNotFound = true
    }else{
            this.navNotFound = false

    }
  }

}
