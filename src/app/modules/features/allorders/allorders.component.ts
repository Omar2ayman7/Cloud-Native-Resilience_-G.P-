import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-allorders',
  imports: [],
  templateUrl: './allorders.component.html',
  styleUrl: './allorders.component.css',
})
export class AllordersComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  readonly orders = signal<any[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    const decodedToken: any = this.authService.decodedToken();
    const userId = decodedToken?.id;

    if (!userId) {
      this.errorMessage.set('Unable to identify the logged-in user.');
      this.isLoading.set(false);
      return;
    }

    this.cartService.getOrdesr(userId).subscribe({
      next: (res) => {
        this.orders.set(Array.isArray(res) ? res : (res?.data ?? []));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Unable to load your orders.');
        this.isLoading.set(false);
      },
    });
  }
}
