import { PinData } from '../api/PinData';
import { Filter } from './Filter';
import { TextFilterType } from './TextFilterType';

export class SearchFilter implements Filter {

    private filter: TextFilterType;

    constructor(filter: TextFilterType) {
        this.filter = filter;
    }

    doFilter(pin: PinData): boolean {
        return pin.data.attributes.some(value =>
            this.filter.checkValue(value.name) || this.filter.checkValue(value.value));
    }
}
