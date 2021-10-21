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

  public circleTexts: any[][] = [];

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
    let circlesAmount = 5;
    let totalRadius = circlesAmount * circleRadius;

    let circleCircles: any[] = [];

    for (let i = 0; i < circlesAmount; i++) {
      let group = new Two.Group();

      let circle = new Two.Circle(0, 0, totalRadius - (i + 1) * circleRadius);
      circle.fill = '#00000077';
      circle.stroke = 'black';
      circleCircles.push(circle);

      this.circleTexts[i] = [];
      let textGroup = new Two.Group();
      textGroup.width = totalRadius - (i + 1) * circleRadius;
      for (let j = 0; j < 4; j++) {
        let text = this.getText(i, 4, j, circleRadius);
        text.rotation = (Math.PI / 4) * j;
        this.circleTexts[i].push(text);
        textGroup.add(text);
        textGroup.rotation += Math.PI / 4;
      }
      group.add(textGroup);

      group.add(circle);
      group.scale = 0.1;
      circleGroups.add(group);
    }
    circleGroups.translation.set(window.innerWidth, window.innerHeight);

    circleGroups.scale = 1;
    this.two.add(circleGroups);
    this.two.update();
    console.log(circleGroups._id);

    for (let i = 0; i < circlesAmount; i++) {
      // https://interactjs.io/docs/draggable/
      let interactable = interact(
        '#' + circleGroups.children[circlesAmount - i - 1]._id
      );
      console.log(interactable);

      interactable.draggable({
        // make the element fire drag events
        origin: 'self', // (0, 0) will be the element's top-left
        inertia: true, // start inertial movement if thrown
        modifiers: [
          interact.modifiers.restrict({
            restriction: 'self', // keep the drag coords within the element
            endOnly: true,
          }),
        ],
        // Step 3
        listeners: {
          move(event) {
            try {
              console.log(event);
              let movement =
                -event.velocity.y / 40000 + event.velocityX / 40000;
              console.log(movement);

              circleGroups.children[i - 1].rotation += movement;

              // console.log(circleTexts[i - 1].length);
              for (let j = 0; j < this.circleTexts[i - 1].length; i++) {
                let circleText = this.circleTexts[i - 1].values[j];
                console.log(circleText);
                this.circleTexts[i][j].rotation -= movement;
              }
            } catch (e) {
              console.log(e);
            }
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

  private getText(
    circleIndex: number,
    textAmount: number,
    textIndex: number,
    circleRadius: number
  ) {
    let singleTextAngle = 360 / textAmount;
    let position = this.getPosition(
      { x: 0, y: 0 },
      -1 * (circleIndex + 1) * circleRadius + circleRadius / 2,
      singleTextAngle * (textIndex + 1)
    );

    // original x = -1 * (circleIndex + 1) * circleRadius + circleRadius / 2,
    let text = new Two.Text('?', position.x, position.y, {
      family: 'proxima-nova, sans-serif',
      size: 50,
      leading: 0,
      weight: 900,
    });
    text.fill = '#FFF';
    return text;
  }
  private getPosition(
    center: { x; y },
    radius: number,
    angle: number
  ): { x; y } {
    let p = {
      x: center.x + radius * Math.cos(this.degrees_to_radians(angle)),
      y: center.y + radius * Math.sin(this.degrees_to_radians(angle)),
    };

    return p;
  }

  private degrees_to_radians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
}
