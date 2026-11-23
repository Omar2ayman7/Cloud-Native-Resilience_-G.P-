import { Routes } from '@angular/router';
import { FeaturesLayoutComponent } from '../../layouts/features-layout/features-layout.component';
import { signInGuard } from '../../core/guards/singIn/sign-in-guard';

export const FEATURES_ROUTES: Routes = [
    {path:'', component:FeaturesLayoutComponent, canActivate:[signInGuard], children:[
        {path:'home', loadComponent:()=>import('./home/home.component').then((c)=> c.HomeComponent), title:'Home'},
        {path:'products', loadComponent:()=>import('./products/products.component').then((c)=> c.ProductsComponent), title:'Products'},
        {path:'categories', loadComponent:()=>import('./categories/categories.component').then((c)=> c.CategoriesComponent), title:'Categories'},
        {path:'brands', loadComponent:()=>import('./brands/brands.component').then((c)=> c.BrandsComponent), title:'Brands'},
        {path:'details/:slug/:id', loadComponent:()=>import('./details/details.component').then((c)=> c.DetailsComponent), title:'Details'},
        {path:'cart', loadComponent:()=>import('./cart/cart.component').then((c)=> c.CartComponent), title:'Cart'},
        {path:'checkout/:id', loadComponent:()=>import('./check-out/check-out.component').then((c)=> c.CheckOutComponent), title:'CheckOut'},
        {path:'allorders', loadComponent:()=>import('./allorders/allorders.component').then((c)=> c.AllordersComponent), title:'Allorders'}

    ]}
];
