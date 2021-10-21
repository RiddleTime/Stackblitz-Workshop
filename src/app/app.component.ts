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

  public static circleTexts: any[][] = [];
  public static circleGroups = new Two.Group();

  ngOnInit(): void {
    // two js : https://two.js.org/#introduction

    this.initTwo();

    this.addText();
  }

  private initTwo() {
    this.two = new Two({
      fullscreen: true,
      fitted: true,
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

    let circleRadius = 70;
    let circlesAmount = 5;
    let totalRadius = circlesAmount * circleRadius;

    let circleCircles: any[] = [];

    for (let i = 0; i < circlesAmount; i++) {
      let group = new Two.Group();

      let circle = new Two.Circle(0, 0, totalRadius - (i + 1) * circleRadius);
      circle.fill = '#00000077';
      circle.stroke = 'black';
      circleCircles.unshift(circle);

      AppComponent.circleTexts[i] = [];
      let textCount = 10;
      for (let j = 0; j < textCount; j++) {
        let text = this.getText(i, textCount, j, circleRadius);
        AppComponent.circleTexts[i].unshift(text);
      }
      for (let j = 0; j < textCount; j++) {
        group.children.unshift(AppComponent.circleTexts[i][j]);
      }
      group.children.unshift(circle);
      group.scale = 1;
      AppComponent.circleGroups.add(group);
    }
    AppComponent.circleGroups.translation.set(
      window.innerWidth,
      window.innerHeight
    );

    AppComponent.circleGroups.scale = 1;
    this.two.add(AppComponent.circleGroups);
    this.two.update();
    console.log(AppComponent.circleGroups._id);

    console.log(
      'circlegroup length: ' + AppComponent.circleGroups.children.length
    );
    console.log(AppComponent.circleGroups.children);
    let circleGroupLength = AppComponent.circleGroups.children.length;
    for (let i = 0; i < circleGroupLength; i++) {
      // https://interactjs.io/docs/draggable/
      let interactable = interact(
        '#' + AppComponent.circleGroups.children[circleGroupLength - 1 - i]._id
      );
      console.log(interactable);

      interactable.draggable({
        // make the element fire drag events
        origin: 'self', // (0, 0) will be the element's top-left
        inertia: true, // start inertial movement if thrown
        modifiers: [
          interact.modifiers.restrict({
            restriction: 'self', // keep the drag coords within the element
            // endOnly: true,
          }),
        ],
        // Step 3
        listeners: {
          start(event) {
            console.log(event);
          },
          end(event) {
            console.log(event);
          },
          move(event) {
            try {
              // console.log(event);
              let movement =
                -event.velocity.y / 30000 + event.velocityX / 30000;

              AppComponent.circleGroups.children[i - 1].rotation += movement;

              for (let j = 0; j < AppComponent.circleTexts[i - 1].length; j++) {
                AppComponent.circleTexts[i - 1][j].rotation -= movement;
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
          for (let i = 0; i < AppComponent.circleGroups.children.length; i++) {
            if (AppComponent.circleGroups.children[i].scale < 2) {
              AppComponent.circleGroups.children[i].scale *= 1.035;
            } else {
              AppComponent.circleGroups.children[i].scale = 2;
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
    center: { x: number; y: number },
    radius: number,
    angle: number
  ): { x: number; y: number } {
    let p = {
      x: center.x + radius * Math.cos(angle * (Math.PI / 180)),
      y: center.y + radius * Math.sin(angle * (Math.PI / 180)),
    };

    return p;
  }
}
