import * as React from 'react';
import '../../styles/App.css';
import '../../styles/map/MapMenu.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RouteComponentProps } from 'react-router';
import { MapData } from '../../types/api/MapData';
import { addPin, deleteMapById, getMapById, putMap } from '../../api/MapApi';
import { LeftBarComponent } from './leftbar/LeftBarComponent';
import { MapContainer } from './MapComponent';
import { PinData } from '../../types/api/PinData';
import { Filter } from '../../types/filter/Filter';
import { deletePin } from '../../api/PinApi';
import { MapSettings } from '../../types/map/MapSettings';
import { removeFromStorage, setInStorage } from '../../utils/localStorage/localStorageUtils';
import { MAP_ID_STORAGE } from '../../constants';
import { AttributeInfo } from '../../types/creation/AttributeInfo';

export interface MapMenuProps {
    id: number;
}

export interface MapMenuState {
    map?: MapData;
    filterPin?: PinData[];
    directions: any;
    leftBar: any;
    leftBarComponentChild?: any;
}

export class MapMenu extends React.Component<RouteComponentProps<MapMenuProps>, MapMenuState> {

    constructor(props: RouteComponentProps<MapMenuProps>) {
        super(props);

        this.state = {
            directions : null,
            leftBar: null,
        };

        this.filter = this.filter.bind(this);
        this.showRoadBetweenMarkers = this.showRoadBetweenMarkers.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.changePins = this.changePins.bind(this);
        this.deletePin = this.deletePin.bind(this);
        this.addPin = this.addPin.bind(this);
        this.deleteMap = this.deleteMap.bind(this);
        this.updateMapSettings = this.updateMapSettings.bind(this);
        this.showInLeftBar = this.showInLeftBar.bind(this);
        this.getPinAttribute = this.getPinAttribute.bind(this);
    }

    componentWillMount() {
        getMapById(this.props.match.params.id,
            map => {
                setInStorage(MAP_ID_STORAGE, map.id);
                this.setState({map});
            },
            () => {
                removeFromStorage(MAP_ID_STORAGE);
            });
    }

    showInLeftBar(leftBarComponentChild: any) {
        this.setState({
            leftBarComponentChild
        });
    }

    filter(filter: Filter) {
        if (this.state.map) {
            this.setState({
                filterPin: this.state.map.pins.filter((marker) => filter.doFilter(marker))
            });
        }
    }

    changePins(pins: PinData[]) {
        const map = this.state.map;
        if (map && map.id) {
            pins.forEach(pin => {
                map.pins.forEach((mapPin, index, mapPins) => {
                    if (mapPin.id && mapPin.id === pin.id) {
                        mapPins[index] = pin;
                    }
                });
            });
            putMap(map, newMap => this.setState({map: newMap}));
        }
    }

    getPinAttribute(pin: PinData) {
        console.log('getPin', pin);
        let attribute: AttributeInfo[] = [];
        const map = this.state.map;
        if (map && map.id) {
            console.log(map.pins);
            map.pins.forEach((mapPin) => {
                if (mapPin.id && mapPin.id === pin.id) {
                    attribute = mapPin.data.attributes;
                }
            });
        }
        return attribute;

    }

    updateMapSettings(mapSettings: MapSettings) {
        const map = this.state.map;
        if (map && map.id) {
            map.data = mapSettings;
            putMap(map, newMap => {
                this.setState({
                    map: newMap
                });
            });

        }
    }

    deletePin(pin: PinData) {
        if (pin.id) {
            deletePin(pin.id, () => {
                const map = this.state.map;
                if (map) {
                    map.pins = map.pins.filter(mapPin => mapPin.id && pin.id !== mapPin.id);
                    this.setState({
                        map
                    });
                }
            });
        }
    }

    addPin(pin: PinData) {
        if (this.state.map && this.state.map.id) {
            addPin(this.state.map.id, pin, newPin => {
                const map = this.state.map;
                if (map) {
                    map.pins.push(newPin);
                    this.setState({
                        map
                    });
                }
            });
        }
    }

    deleteMap() {
        if (this.state.map && this.state.map.id) {
            deleteMapById(this.state.map.id, () => {
                this.props.history.push('/home');
            });
        }
    }

    showRoadBetweenMarkers(result: any) {
        this.setState({
            directions: result,
        });
    }

    removeFilter() {
        this.setState({filterPin: undefined});
    }

    render() {
        if (this.state.map) {
            const visiblePins = this.state.filterPin || this.state.map.pins;
            return (
                <div className="menu" >
                    <LeftBarComponent
                        filter={this.filter}
                        removeFilter={this.removeFilter}
                        showRoadBetweenMarkers={this.showRoadBetweenMarkers}
                        visiblePins={visiblePins}
                        changePins={this.changePins}
                        deleteMap={this.deleteMap}
                        callbackOnRef={(ref: any) => (this.setState({ leftBar: ref}))}
                        leftBarComponentChild={this.state.leftBarComponentChild}
                        showInLeftBar={this.showInLeftBar}
                    />
                    <MapContainer
                        map={this.state.map}
                        getPinAttribute={this.getPinAttribute}
                        visiblePins={visiblePins}
                        addPin={this.addPin}
                        changePins={this.changePins}
                        deletePin={this.deletePin}
                        directions={this.state.directions}
                        leftBar={this.state.leftBar}
                        updateMapSettings={this.updateMapSettings}
                        showInLeftBar={this.showInLeftBar}
                    />
                </div>
            );
        }
        return null;
    }
}
