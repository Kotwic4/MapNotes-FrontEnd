// tslint:disable:max-line-length
export const GOOGLE_MAP_KEY = process.env.REACT_APP_GOOGLE_MAP_KEY;
export const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&v=3.exp&libraries=geometry,drawing,places`;
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const BASE_ICON_URL = 'https://maps.google.com/mapfiles/ms/icons/';
export const MAP_ID_STORAGE = 'mapID';
export const TYPES = [ 'm^2', 'pln', 'yes/no', 'text', 'number', 'other' ];
export const OPERATORS = ['+', '-', '*', '/'];
