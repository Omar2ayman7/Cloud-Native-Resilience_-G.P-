import { Component, inject, Input } from '@angular/core';
import { Product } from '../../../core/models/product.interface';
import { RouterLink } from "@angular/router";
import { CartService } from '../../../modules/features/cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card',
  imports: [RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input({required:true}) product:Product = {} as Product

  private readonly cartService = inject(CartService)
  private readonly toastrService = inject(ToastrService)

  addProductToCart( id: string):void{
    this.cartService.cartOfItem(id).subscribe({
      next: (res)=>{
        console.log(res);
        if(res.status === 'success'){
          this.toastrService.success(res.message , 'Fresh-Cart')
        }
        
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }


}
