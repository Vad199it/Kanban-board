import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appLabelFilter' })
export class LabelFilterPipe implements PipeTransform {
  transform(items: any[], labelsIdArray: any[]): any[] {
    if (!items) {
      return [];
    }
    if (!labelsIdArray) {
      return items;
    }

    function comparer(otherArray): any{
      return (current) => {
        return otherArray.filter((other) => {
          return other.uid === current.uid;
        }).length === 0;
      };
    }

    const onlyInA = items.filter(comparer(labelsIdArray));
    const onlyInB = labelsIdArray.filter(comparer(items));

    return onlyInA.concat(onlyInB);
  }
}
