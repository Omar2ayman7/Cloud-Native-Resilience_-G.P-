import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../core/services/products/products.service';
import { Product } from '../../../core/models/product.interface';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-products',
  imports: [CardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
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
