import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'rupiah'
})
export class RupiahPipe implements PipeTransform {
  transform(value: any, ...args: any[]): string {
    const num = Number(value);
    if (isNaN(num)) return '-';
    return 'Rp. ' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,').replace('.00', ',00');
  }

}
