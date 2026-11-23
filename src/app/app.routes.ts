import { Routes } from '@angular/router';

export const routes: Routes = [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'', loadChildren:()=>import('./modules/auth/auth.routes').then((m)=> m.AUTH_ROUTES)},
    {path:'', loadChildren:()=>import('./modules/features/features.routes').then((m)=> m.FEATURES_ROUTES)},
    {path:'**', loadComponent:()=>import('./modules/features/not-found/not-found.component').then((c)=> c.NotFoundComponent), title:'Notfound'}
];
