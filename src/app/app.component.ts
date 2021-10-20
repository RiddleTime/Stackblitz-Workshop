import {
  Component,
  ElementRef,
  VERSION,
  ViewChild,
  OnInit,
} from '@angular/core';
import { AnalysisFailure } from '@angular/core/schematics/migrations/missing-injectable/transform';
import Two from 'two.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  two;

  androidVersion = 'Angular ' + VERSION.major;

  ngOnInit(): void {
    // this.ctx = this.canvas.nativeElement.getContext('2d');

    // this.setCanvasSize();
    // this.drawGraphics();

    this.tryTwo();
  }

  private tryTwo() {
    this.two = new Two({
      fullscreen: true,
      autostart: true,
    }).appendTo(document.body);

    var circle = this.two.makeCircle(-70, 0, 50);
    var rect = this.two.makeRectangle(70, 0, 100, 100);
    circle.fill = '#FF8000';
    circle.stroke = 'orangered';
    rect.fill = 'rgba(0, 200, 255, 0.75)';
    rect.stroke = '#1C75BC';

    // Groups can take an array of shapes and/or groups.
    var group = this.two.makeGroup(circle, rect);

    // And have translation, rotation, scale like all shapes.
    group.translation.set(this.two.width / 2, this.two.height / 2);
    group.rotation = Math.PI;
    group.scale = 0.75;

    // You can also set the same properties a shape have.
    group.linewidth = 7;
    this.two.add(group);

    // Bind a function to scale and rotate the group
    // to the animation loop.
    this.two
      .bind('update', function (frameCount) {
        // This code is called everytime two.update() is called.
        // Effectively 60 times per second.
        if (group.scale > 0.9999) {
          group.scale = group.rotation = 0;
        }

        var t = (1 - group.scale) * 0.125;
        group.scale += t;
        group.rotation += t * 4 * Math.PI;
      })
      .play(); // Finally, start the animation loop

    this.addText();
  }

  private addText() {
    var styles = {
      family: 'proxima-nova, sans-serif',
      size: 50,
      leading: 50,
      weight: 900,
    };
    var text = this.two.makeText(
      'Text test yes',
      window.innerWidth / 2,
      window.innerHeight / 4,
      styles
    );

    this.two
      .bind('update', function (frameCount) {
        if (frameCount % 100 == 0) text.value = Math.round(Math.random() * 100);
        // text.rotation -= 0.01;
      })
      .play(); // Finally, start the animation loop
  }
}
