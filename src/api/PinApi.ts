import axios from 'axios';
import { BASE_URL } from '../constants';
import { PinData } from '../types/PinData';

const PIN_URL = BASE_URL + '/pin';

export function deletePin(id: number, cb: () => void) {
    axios.delete(PIN_URL + '/' + id)
        .then(function () {
            cb();
        })
        .catch(function (error: any) {
            console.log(error);
        });
}

export function getAllPins(cb: (pins: PinData[]) => void) {
    axios.get(PIN_URL)
        .then(function (response: any) {
            cb(response.data);
        })
        .catch(function (error: any) {
            console.log(error);
        });
}

export function getPinById(id: number, cb: (pin: PinData) => void) {
    axios.get(PIN_URL + '/' + id)
        .then(function (response: any) {
            cb(response.data);
        })
        .catch(function (error: any) {
            console.log(error);
        });
}
