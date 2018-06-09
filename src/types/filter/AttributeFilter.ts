import { PinData } from '../api/PinData';
import { Filter } from './Filter';
import { TextFilterType } from './TextFilterType';
import { ValueFilterType } from './ValueFilterType';

export class AttributeFilter implements Filter {

    private keyFilter: TextFilterType;
    private valueFilter: ValueFilterType;

    constructor( keyFilter: TextFilterType, valueFilter: ValueFilterType) {
        this.keyFilter = keyFilter;
        this.valueFilter = valueFilter;
    }

    doFilter(pin: PinData): boolean {
        return pin.data.attributes.some(value =>
            this.keyFilter.checkValue(value.name) && this.valueFilter.checkValue(value.value));
    }

}
