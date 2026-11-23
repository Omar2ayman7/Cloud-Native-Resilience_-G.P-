import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services/products/products.service';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { Product } from '../../../../core/models/product.interface';

@Component({
  selector: 'app-popular-products',
  imports: [CardComponent],
  templateUrl: './popular-products.component.html',
  styleUrl: './popular-products.component.css',
})
export class PopularProductsComponent implements OnInit {
  private readonly productsService =inject(ProductsService)

  readonly ProductsList = signal<Product[]>([])
  
  ngOnInit(): void {
    this.getAllProducts()
    console.log(this.ProductsList())
  }
  getAllProducts(): void{
    this.productsService.getProduct().subscribe({
      next:(res)=>{
        this.ProductsList.set(res.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
}
