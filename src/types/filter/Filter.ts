import { PinData } from '../api/PinData';

export interface Filter {
    doFilter(pin: PinData): boolean;
}
