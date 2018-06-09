import { AttributeInfo } from '../creation/AttributeInfo';

export interface MarkerData {
    position:  google.maps.LatLngLiteral;
    isWindowOpened: boolean;
    groupName: string;
    attributes: AttributeInfo[];
}
