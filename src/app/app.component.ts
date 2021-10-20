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
    let text = new Two.Text(
      Math.round(Math.random() * 100 + 1),
      window.innerWidth / 2,
      60,
      styles
    );
    text.fill = '#000';
    let topInfoGroup = this.two.makeGroup(text);
    this.two.add(topInfoGroup);

    let circleGroups = new Two.Group();

    let circleRadius = 70;

    let circleTexts: any[] = [];
    let circleCircles: any[] = [];

    for (let i = 0; i < 5; i++) {
      let group = new Two.Group();

      let circle = new Two.Circle(0, 0, (i + 1) * circleRadius);
      circle.fill = '#00000077';
      circle.stroke = 'black';
      circle.bind('ontouchend', (e) => {
        console.log(e);
      });
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

      circleGroups.add(group);
    }
    circleGroups.translation.set(window.innerWidth, window.innerHeight);

    circleGroups.scale = 0.1;
    this.two.add(circleGroups);
    this.two.update();

    for (let i = 0; i < circleCircles.length; i++) {
      document
        .querySelector('#' + text._id)
        .addEventListener('ontouchstart', (e) => {
          console.log('henlo ' + i);
        });
      let interactable = interact('.' + circleCircles[i]._id);
      interactable.draggable({
        listeners: {
          move: showEventInfo,
          onend: showEventInfo,
        },
      });
    }

    function showEventInfo(event) {
      const actionInfo = JSON.stringify(event.interaction.prepared, null, 2);

      event.target.textContent = `action: ${actionInfo} \ncoords: ${event.pageX}, ${event.pageY}`;
    }

    this.two
      .bind('update', (frameCount: number) => {
        if (frameCount % 2 == 0) {
          if (circleGroups.scale < 1) {
            circleGroups.scale *= 1.035;
          } else {
            circleGroups.scale = 1;
            circleGroups.rotation += 0.01;

            for (let i = 0; i < circleTexts.length; i++) {
              circleTexts[i].rotation -= 0.01;

              // console.log(circleTexts[i]._id);
            }

            text.value = Math.round(Math.random() * 100 + 1);
          }
        }
      })
      .play(); // Finally, start the animation loop
  }
}
