import { Component, inject, Input } from '@angular/core';
import { FlowbiteService } from '../../../core/services/flowbite.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  @Input({required:true})  isLogin!:boolean

  private readonly router = inject(Router)
  private readonly cookieService = inject(CookieService)
  private readonly authService = inject(AuthService)
  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite((flowbite) => {
      initFlowbite();
    });

  }

  logOut():void{
    this.authService.logOut()
  }

}
