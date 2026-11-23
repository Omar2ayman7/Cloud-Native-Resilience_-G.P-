import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../layouts/auth-layout/auth-layout.component';
import { signOutGuard } from '../../core/guards/signOut/sign-out-guard';

export const AUTH_ROUTES: Routes = [
    {path:'', component:AuthLayoutComponent, canActivate:[signOutGuard], children:[
    {path:'login', loadComponent:()=>import('./login/login.component').then((c)=> c.LoginComponent), title:'Login'},
    {path:'register', loadComponent:()=>import('./register/register.component').then((c)=> c.RegisterComponent), title:'Register'}
    ]}
    
];
