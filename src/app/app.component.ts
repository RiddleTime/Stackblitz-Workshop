import {
  Component,
  ElementRef,
  VERSION,
  ViewChild,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;

  name = 'Angular ' + VERSION.major;

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.setCanvasSize();
    this.drawGraphics();
  }

  private drawGraphics() {
    this.ctx.fillStyle = 'FF0000';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.ctx.fillStyle = 'FFFFFF';
    this.ctx.fillText('hello', 20, 20);
    this.ctx.fillStyle = '00FF00';
    this.ctx.arc(50, 50, 90, 0, 0);
  }

  private setCanvasSize() {
    this.canvas.nativeElement.width = window.outerWidth;
    this.canvas.nativeElement.height = window.outerHeight;
  }
}
