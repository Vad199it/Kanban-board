import { Pipe, PipeTransform } from '@angular/core';
import {User} from '../models/user';

@Pipe({ name: 'appFilterUsers' })
export class FilterUsersPipe implements PipeTransform {
  transform(items: User[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();
    return items.filter(it => {
      return it.displayName.toLocaleLowerCase().includes(searchText);
    });
  }
}
