import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoriesService } from '../../../../core/services/categories/categories.service';
import { Category } from '../../../../core/models/category.interface';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-popular-categories',
  imports: [CarouselModule],
  templateUrl: './popular-categories.component.html',
  styleUrl: './popular-categories.component.css',
})
export class PopularCategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService)

  readonly categoriesList = signal<Category[]>([])

  ngOnInit(): void {
    this.getCategoriesData()
  }

  getCategoriesData():void {
    this.categoriesService.getGategories().subscribe({
      next:(res)=>{
        this.categoriesList.set(res.data)
        console.log(res.data)
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }
  categoriesOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    margin:10,
    navSpeed: 700,
    navText: ['Next', 'Prev'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
}
