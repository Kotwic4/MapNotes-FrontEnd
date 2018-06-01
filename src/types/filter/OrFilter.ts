import { PinData } from '../api/PinData';
import { Filter } from './Filter';

export class OrFilter implements Filter {

    private filters: Filter[];

    constructor(filters: Filter[]) {
        this.filters = filters;
    }

    doFilter(pin: PinData): boolean {
        return this.filters.some((filter: Filter) => filter.doFilter(pin));
    }
}