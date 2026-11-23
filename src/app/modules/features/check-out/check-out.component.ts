import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart/services/cart.service';

@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.css',
})
export class CheckOutComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly CartService = inject(CartService)


  chceckOutForm!:FormGroup;

  id: string | null = null;

  ngOnInit(): void {
    this.initForm()
    this.getCartId()
  }

  getCartId(){
    this.activatedRoute.paramMap.subscribe({
      next:(res)=>{
        this.id = res.get('id')
        console.log(this.id);
        
      }
    })
  }

  initForm():void{
    this.chceckOutForm = this.fb.group({
      shippingAddress: this.fb.group({

        details: ['', [Validators.required]],
        phone: ['', [Validators.required,  Validators.pattern(/^01[0125][0-9]{8}$/)]],
        city: ['', [Validators.required]]
      })
        
      })
  }


submiForm():void{
  if(this.chceckOutForm.valid){

      this.CartService.checkOutSession(this.id, this.chceckOutForm.value).subscribe({
        next:(res)=>{
          console.log(res);
          if(res.status === "success"){
            window.open(res.session.url , '_self')
          }
        },
        error:(err)=>{
          console.log(err);
        }
      })
      
  }
}

}
