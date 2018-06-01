import { PinData } from './PinData';
import { MapSettings } from '../map/MapSettings';

export interface MapData {
    data: MapSettings;
    id?: number;
    pins: PinData[];
}
