import Two from 'two.js';

export class Wheel {
  public index: number;
  public contentAmount: number;

  public contentShapes: any[] = [];
  public contentBackgrounds: any[] = [];

  public wheelGroup = new Two.Group();

  constructor(index: number, contentAmount: number) {
    this.index = index;
    this.contentAmount = contentAmount;
  }

  public getContentAngle() {
    return 360 / this.contentAmount;
  }
}
