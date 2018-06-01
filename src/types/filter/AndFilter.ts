import { PinData } from '../api/PinData';
import { Filter } from './Filter';

export class AndFilter implements Filter {

    private filters: Filter[];

    constructor(filters: Filter[]) {
        this.filters = filters;
    }

    doFilter(pin: PinData): boolean {
        return this.filters.every((filter: Filter) => filter.doFilter(pin));
    }

}