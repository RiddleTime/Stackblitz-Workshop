import {
  Component,
  ElementRef,
  VERSION,
  ViewChild,
  OnInit,
} from '@angular/core';
import Two from 'two.js';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  androidVersion = 'Angular ' + VERSION.major;

  ngOnInit(): void {
    // this.ctx = this.canvas.nativeElement.getContext('2d');

    // this.setCanvasSize();
    // this.drawGraphics();

    this.tryTwo();
  }

  private tryTwo() {
    var two = new Two({
      fullscreen: true,
      autostart: true,
    }).appendTo(document.body);

    var circle = two.makeCircle(-70, 0, 50);
    var rect = two.makeRectangle(70, 0, 100, 100);
    circle.fill = '#FF8000';
    circle.stroke = 'orangered';
    rect.fill = 'rgba(0, 200, 255, 0.75)';
    rect.stroke = '#1C75BC';

    // Groups can take an array of shapes and/or groups.
    var group = two.makeGroup(circle, rect);

    // And have translation, rotation, scale like all shapes.
    group.translation.set(two.width / 2, two.height / 2);
    group.rotation = Math.PI;
    group.scale = 0.75;

    // You can also set the same properties a shape have.
    group.linewidth = 7;
    two.add(group);

    // Bind a function to scale and rotate the group
    // to the animation loop.
    two
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
  }

  private setCanvasSize() {
    this.canvas.nativeElement.width = window.outerWidth;
    this.canvas.nativeElement.height = window.outerHeight;
  }
}
