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
        const keys = Object.keys(pin.data.attributes);
        return keys.some((key: any) =>
            this.keyFilter.checkValue(key) && this.valueFilter.checkValue(pin.data.attributes[key]));
    }

}