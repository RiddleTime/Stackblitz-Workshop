import { Component, VERSION, OnInit, HostListener } from '@angular/core';
import Two from 'two.js';
import interact from 'interactjs';
import { Wheel } from '../wheel.object';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  two: any;

  public static wheels: Wheel[] = [];

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

    let circlesAmount = 5;
    let circleRadius = window.innerWidth / circlesAmount / 2.5;
    let totalRadius = circlesAmount * circleRadius;

    for (let i: number = circlesAmount; i > 0; i--) {
      let contentAmount = 0;
      switch (i) {
        case 1:
          contentAmount = 9;
          break;
        case 2:
          contentAmount = 15;
          break;
        case 3:
          contentAmount = 21;
          break;
        case 4:
          contentAmount = 27;
          break;
        case 5:
          contentAmount = 33;
          break;
      }
      let wheel = new Wheel(i, contentAmount);

      if (i > 0) {
        console.log(
          'wheel ' + i + ' has ' + wheel.contentAmount + ' amount of text.'
        );
        for (let j = 0; j < wheel.contentAmount; j++) {
          let text = this.getText(i, wheel.contentAmount, j, circleRadius);
          wheel.contentShapes.unshift(text);
          wheel.radius = circleRadius;

          var rect = this.two.makeCircle(
            text._translation.x,
            text._translation.y,
            circleRadius / 2
          );
          rect.fill = 'rgba(60, 200, 0, ' + i * 0.08 + ')';
          rect.stroke = '#1C75BC';
          wheel.contentBackgrounds.unshift(rect);

          wheel.wheelGroup.children.unshift(rect);
          wheel.wheelGroup.children.unshift(text);
        }
      }
      wheel.wheelGroup.scale = 1;
      // wheel.wheelGroup.fill = '#00000088';
      wheel.wheelGroup.stroke = '#000';

      AppComponent.wheels.unshift(wheel);
    }
    // console.log(AppComponent.wheels);

    for (let i = 0; i < AppComponent.wheels.length; i++) {
      console.log(AppComponent.wheels[i].wheelGroup);
      AppComponent.wheels[i].wheelGroup.translation.set(
        window.innerWidth,
        window.innerHeight - circleRadius / 2
      );
      AppComponent.wheels[i].wheelGroup.scale = 1;

      this.two.add(AppComponent.wheels[i].wheelGroup);
    }

    this.two.update();

    this.addWheelMoveListeners();

    this.two
      .bind('update', (frameCount: number) => {
        if (frameCount % 2 == 0) {
          for (let i = 0; i < AppComponent.wheels.length; i++) {
            let wheel = AppComponent.wheels[i];
            if (wheel.wheelGroup.scale < 2) {
              wheel.wheelGroup.scale *= 1.035;
            } else {
              wheel.wheelGroup.scale = 2;

              let autoRotate = false;
              if (autoRotate) {
                let rotationAmount = 0.001 * (i * 2 + 1);

                // Auto rotate the wheel and counterrotate the content;
                wheel.wheelGroup.rotation += rotationAmount;
                for (let i = 0; i < wheel.contentShapes.length; i++) {
                  wheel.contentShapes[i].rotation -= rotationAmount;
                }
              }
            }
          }
        }

        if (frameCount % 30 == 0) {
          // this.hideOffScreenElements();
        }

        if (frameCount % 60 == 0) {
          text.value++;
        }
      })
      .play(); // Finally, start the animation loop
  }

  private addWheelMoveListeners() {
    console.log('adding interactive js listeners to each wheel');
    for (let i = 0; i < AppComponent.wheels.length; i++) {
      let wheel = AppComponent.wheels[i];
      // https://interactjs.io/docs/draggable/
      let interactable = interact('#' + wheel.wheelGroup._id);
      console.log(interactable);

      interactable.draggable({
        // make the element fire drag events
        origin: 'self', // (0, 0) will be the element's top-left
        inertia: true, // start inertial movement if thrown
        modifiers: [
          interact.modifiers.restrict({
            // restriction: 'self', // keep the drag coords within the element
            // endOnly: true,
          }),
        ],
        // Step 3
        listeners: {
          start(event) {
            // console.log(event);
          },
          end(event) {
            // console.log(event);
          },
          move(event) {
            try {
              // console.log(event);

              let movement =
                -event.velocity.y / 35000 + event.velocityX / 35000;

              movement = (movement / wheel.radius) * 100;

              let maxSpeed = 0.025;
              movement = movement > maxSpeed ? maxSpeed : movement;
              movement = movement < -maxSpeed ? -maxSpeed : movement;

              let minSpeed = 0.

              // rotate the entire wheelgroup
              console.log(
                'Moving Wheel ' +
                  wheel.index +
                  ', from ' +
                  wheel.wheelGroup.rotation +
                  ' by ' +
                  movement
              );
              wheel.wheelGroup.rotation += movement;

              // counter rotate the content shapes
              for (let j = 0; j < wheel.contentShapes.length; j++) {
                wheel.contentShapes[j].rotation -= movement;
              }
            } catch (e) {
              console.log(e);
            }
          },
        },
      });
    }
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
    let text = new Two.Text(textIndex, position.x, position.y, {
      family: 'proxima-nova, sans-serif',
      size: circleRadius / 2,
      leading: 0,
      weight: 900,
    });
    text.fill = '000';
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

  private hideOffScreenElements() {
    // console.log('hiding');
    for (let i = 0; i < AppComponent.wheels.length; i++) {
      let wheel: Wheel = AppComponent.wheels[i];
      let wheelRotation: number = (wheel.wheelGroup.rotation * 180) / Math.PI;

      if (wheelRotation < 0) wheelRotation = 360 + wheelRotation;

      let contentAngle = wheel.getContentAngle();
      for (let k = 0; k < wheel.contentShapes.length; k++) {
        let shapeAngle = (wheel.contentShapes[k].rotation * 180) / Math.PI;
        console.log(shapeAngle);
        if (shapeAngle < 0) shapeAngle *= -1;
        if (shapeAngle >= 270 && shapeAngle <= 360) {
          wheel.contentShapes[k].visible = true;
          // wheel.contentBackgrounds[k].visible = true;
          wheel.contentBackgrounds[k].fill = 'white';
        } else {
          // console.log(shapeAngle);
          // wheel.contentShapes[k].visible = false;
          // wheel.contentBackgrounds[k].visible = false;
          wheel.contentBackgrounds[k].fill = 'black';
        }
      }
    }
  }
}
