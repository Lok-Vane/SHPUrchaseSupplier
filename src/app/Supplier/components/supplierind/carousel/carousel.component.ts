import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  constructor() { }

  // array = ['和行天下', '承载未来'];

  imgUrl = [
    '././././assets/imgs/hxtx.gif', '././././assets/imgs/czwl.gif'
  ];

  ngOnInit() {
  }
}
