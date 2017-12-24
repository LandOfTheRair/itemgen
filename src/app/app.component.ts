import { Component, ViewChild } from '@angular/core';
import find from 'lodash.find';
import get from 'lodash.get';
import set from 'lodash.set';
import clonedeep from 'lodash.clonedeep';
import * as YAML from 'yamljs';

import * as itemData from '../item-stats.json';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {

  @ViewChild('editor')
  public editor;

  public tier: number = 1;
  public baseItem: any;
  public item: any;
  public itemYML: string;

  public get data(): any[] {
    return itemData.default;
  }

  public get spriteLocation() {
    const divisor = 32;
    const y = Math.floor(this.item.sprite / divisor);
    const x = this.item.sprite % divisor;
    return `-${x * 64}px -${y * 64}px`;
  }

  public selectItem($event) {
    const item = find(this.data, { name: $event.target.value });
    this.item = clonedeep(item);
    this.baseItem = clonedeep(item);
    this.item.sprite = 0;

    this.updateTier();
  }

  public updateTier() {
    [
      'stats.armorClass', 'stats.offense', 'stats.defense', 'stats.accuracy',
      'baseDamage', 'minDamage', 'maxDamage', 'damageRolls'
    ].forEach(key => {
      const value = get(this.baseItem, key);
      set(this.item, key, value * this.tier);
    });

    this.updateYML();
  }

  private updateYML() {
    this.itemYML = YAML.stringify([this.item], 3, 2);
  }

}
