import { Component, Input } from '@angular/core';

@Component({
  selector: 'hello',
  template: `<h1>This is an example</h1>
              <p> using {{androidVersion}}!</p>
              <p>using <a href="https://two.js.org/">Two.js</a> </p>`,
  styles: [`h1 { font-family: Lato; }`],
})
export class HelloComponent {
  @Input() androidVersion: string;
}
