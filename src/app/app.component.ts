import { Component, VERSION, OnInit, HostListener } from '@angular/core';
import Two from 'two.js';
import interact from 'interactjs';

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
    let text = new Two.Text(0, window.innerWidth / 2, 60, styles);
    text.fill = '#000';
    let topInfoGroup = this.two.makeGroup(text);
    this.two.add(topInfoGroup);

    let circleGroups = new Two.Group();

    let circleRadius = 70;

    let circleTexts: any[] = [];
    let circleCircles: any[] = [];

    let circlesAmount = 5;
    let totalRadius = circlesAmount * circleRadius;

    for (let i = 0; i < circlesAmount; i++) {
      let group = new Two.Group();

      let circle = new Two.Circle(0, 0, totalRadius - (i + 1) * circleRadius);
      circle.fill = '#00000077';
      circle.stroke = 'black';
      circleCircles.push(circle);

      let text = new Two.Text(
        '?',
        -1 * (i + 1) * circleRadius + circleRadius / 2,
        -25,
        {
          family: 'proxima-nova, sans-serif',
          size: 50,
          leading: 0,
          weight: 900,
        }
      );
      text.fill = '#FFF';
      circleTexts.push(text);

      group.add(circle);
      group.add(text);
      group.scale = 0.1;
      circleGroups.add(group);
    }
    circleGroups.translation.set(window.innerWidth, window.innerHeight);

    circleGroups.scale = 1;
    this.two.add(circleGroups);
    this.two.update();

    for (let i = 0; i < circlesAmount; i++) {
      // https://interactjs.io/docs/draggable/
      const interactable = interact(
        '#' + circleCircles[circlesAmount - i - 1]._id
      );
      console.log(interactable);

      interactable.on('move', (event) => {
        console.log(event);
        console.log(event.speed);

        //  event.velocity / 100;
      });

      interactable.draggable({
        // make the element fire drag events
        origin: 'self', // (0, 0) will be the element's top-left
        inertia: true, // start inertial movement if thrown
        modifiers: [
          interact.modifiers.restrict({
            restriction: 'self', // keep the drag coords within the element
          }),
        ],
        // Step 3
        listeners: {
          move(event) {
            console.log(event);
            let movement = -event.velocity.y / 40000 + event.velocityX / 40000;
            console.log(movement);

            circleGroups.children[i - 1].rotation += movement;
            circleTexts[i - 1].rotation -= movement;
            // call this listener on every dragmove
            // const sliderWidth = interact.getElementRect(event.target).width;
            // const value = event.pageX / sliderWidth;

            // event.target.style.paddingLeft = value * 100 + '%';
            // event.target.setAttribute('data-value', value.toFixed(2));
          },
        },
      });
    }

    this.two
      .bind('update', (frameCount: number) => {
        if (frameCount % 2 == 0) {
          for (let i = 0; i < circleGroups.children.length; i++) {
            if (circleGroups.children[i].scale < 2) {
              circleGroups.children[i].scale *= 1.035;
            } else {
              circleGroups.children[i].scale = 2;
              // circleGroups.children[i].rotation += 0.01 * (i % 2 ? 1 : -1);

              // circleTexts[i].rotation -= 0.01 * (i % 2 ? 1 : -1);
            }
          }
        }

        if (frameCount % 60 == 0) {
          text.value++;
        }
      })
      .play(); // Finally, start the animation loop
  }
}
