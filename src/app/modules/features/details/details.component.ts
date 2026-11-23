import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetailsServiceService } from './service/product-details-service.service';
import { Product } from '../../../core/models/product.interface';
import { CartService } from '../cart/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly productDetailsService = inject(ProductDetailsServiceService);
  private readonly cartService = inject(CartService);
  private readonly toastrService = inject(ToastrService);

  readonly productDetails = signal<Product | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.isLoading.set(true);
          this.errorMessage.set('');
          return this.productDetailsService.getProductDetails(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.productDetails.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage.set('Unable to load product details.');
          this.isLoading.set(false);
        },
      });
  }

  addProductToCart(id: string): void {
    this.cartService.cartOfItem(id).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.toastrService.success(res.message, 'Fresh-Cart');
        }
      },
      error: (err) => console.error(err),
    });
  }
}
