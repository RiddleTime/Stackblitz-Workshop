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

    let circles = new Two.Group();
    for (let i = 0; i < 5; i++) {
      let group = new Two.Group();

      let circle = new Two.Circle(0, 0, (i + 1) * 40);
      circle.fill = '#00000077';
      circle.stroke = 'black';
      group.add(circle);

      let text = new Two.Text('+', (i + 1) * 40 - 20, 0, {
        family: 'proxima-nova, sans-serif',
        size: 50,
        leading: 0,
        weight: 900,
      });

      group.add(text);

      circles.add(group);
    }
    circles.translation.set(window.innerWidth, window.innerHeight);

    circles.scale = 0.1;
    this.two.add(circles);
    this.two.update();

    this.two
      .bind('update', (frameCount: number) => {
        if (frameCount % 2 == 0) {
          if (circles.scale < 1) {
            circles.scale *= 1.02;
          } else {
            circles.scale = 1;
            circles.rotation -= 0.1;

            for (let i = 0; i < circles.children.count; i++) {
              let textChild = circles.children[i].children[1];
              textChild.rotation.set(textChild.rotation + 0.1);
            }

            text.value = Math.round(Math.random() * 100 + 1);
          }
        }
      })
      .play(); // Finally, start the animation loop
  }
}
