import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appFilterTasks' })
export class FilterTasksPipe implements PipeTransform {
  transform(items: any[], tasksIdArray: string[]): any[] {
    if (!items) {
      return [];
    }
    if (!tasksIdArray) {
      return [];
    }
    const m = tasksIdArray.reduce((r, k, i) => { return r[k] = i,r; }, {});
    return items.sort((a, b) => { return m[a.id] - m[b.id]; });
  }
}
