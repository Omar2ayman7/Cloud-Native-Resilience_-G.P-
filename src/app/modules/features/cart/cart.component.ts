import { Component, inject, OnInit, signal } from '@angular/core';
import { CartService } from './services/cart.service';
import { Cart } from './interface/cart.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private readonly cartService = inject(CartService);

  readonly cartDetails = signal<Cart | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.getLoggedUserCart();
  }

  getLoggedUserCart(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.cartService.getLoggedCart().subscribe({
      next: (res) => {
        this.cartDetails.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Unable to load your cart. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  removeItemOfCart(id: string): void {
    this.cartService.removeItem(id).subscribe({
      next: (res) => this.cartDetails.set(res.data),
      error: (err) => console.error(err),
    });
  }

  updateCountOfItem(id: string, count: number): void {
    if (count < 1) {
      this.removeItemOfCart(id);
      return;
    }

    this.cartService.updateCount(id, count).subscribe({
      next: (res) => this.cartDetails.set(res.data),
      error: (err) => console.error(err),
    });
  }
}
