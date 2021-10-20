import { Component, VERSION, OnInit, HostListener } from '@angular/core';
import Two from 'two.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  two: any;

  androidVersion = 'Angular ' + VERSION.major;

  @HostListener('ontouchend') OnTouchEnd() {
    alert("Don't touch my bacon!");
  }

  ngOnInit(): void {
    // two js : https://two.js.org/#introduction

    this.initTwo();

    // this.tryTwo();
    this.addText();
  }

  private initTwo() {
    this.two = new Two({
      fullscreen: true,
      autostart: true,
    }).appendTo(document.body);
  }

  private addText() {
    let styles = {
      family: 'proxima-nova, sans-serif',
      size: 50,
      leading: 50,
      weight: 900,
    };
    let text = new Two.Text(
      Math.round(Math.random() * 100 + 1),
      window.innerWidth / 2,
      60,
      styles
    );
    text.fill = '#000';
    let topInfoGroup = this.two.makeGroup(text);
    this.two.add(topInfoGroup);

    let circleGroup = new Two.Group();
    for (let i = 0; i < 5; i++) {
      let circle = new Two.Circle(
        window.innerWidth,
        window.innerHeight,
        (i + 1) * 80
      );
      circle.fill = '#00000077';
      circle.stroke = 'black';

      circleGroup.add(circle);
    }
    this.two.add(circleGroup);

    let circleGroup2 = new Two.Group();
    for (let i = 0; i < 5; i++) {
      let circle = new Two.Circle(0, 0, (i + 1) * 80);
      circle.fill = '#33AA0077';
      circle.stroke = 'black';

      circleGroup2.add(circle);
    }
    this.two.add(circleGroup2);

    let circle = new Two.Circle(window.innerWidth, window.innerHeight, 50);
    circle.fill = '#00000077';
    circle.stroke = 'red';

    this.two
      .bind('update', (frameCount: number) => {
        if (frameCount % 2 == 0)
          if (circleGroup2.scale < 1)
            // text.rotation -= 0.01
            circleGroup2.scale += 0.01;
          else {
            circleGroup2.scale = 0.5;
            circleGroup2.value = Math.round(Math.random() * 100);
            text.value = Math.round(Math.random() * 100 + 1);
          }
        this.two.un;
      })
      .play(); // Finally, start the animation loop
  }
}
