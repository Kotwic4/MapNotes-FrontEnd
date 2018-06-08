import * as React from 'react';
import '../../styles/App.css';
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

export interface MapMenuProps {
    id: number;
}

export interface MapMenuState {
    map?: MapData;
    filterPin?: PinData[];
    directions: any;
    leftBar: any;
    leftBarComponentChild?: any;
    animatedId: any;
}

export class MapMenu extends React.Component<RouteComponentProps<MapMenuProps>, MapMenuState> {

    constructor(props: RouteComponentProps<MapMenuProps>) {
        super(props);

        this.state = {
            directions : null,
            leftBar: null,
            animatedId: -1,
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
        this.animatePin = this.animatePin.bind(this);
    }

    componentWillMount() {
        getMapById(this.props.match.params.id, map => this.setState({ map }));
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

    updateMapSettings(mapSettings: MapSettings) {
        const map = this.state.map;
        if (map && map.id) {
            map.data = mapSettings;
            putMap(map, newMap => {
                this.setState({map: newMap});
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
                this.props.history.push('/');
            });
        }
    }

    showRoadBetweenMarkers(result: any) {
        this.setState({
            directions: result,
        });
    }

    animatePin(id: number) {
        console.log('jestem w animatePin w MapMenu, id pinezki to');
        console.log(id);
        this.setState({
            animatedId: id
        });
    }

    removeFilter() {
        this.setState({filterPin: undefined});
    }

    render() {
        if (this.state.map) {
            const visiblePins = this.state.filterPin || this.state.map.pins;
            return (
                <div style={{height: '100%'}} >
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
                        showAnimation={this.animatePin}
                    />
                    <MapContainer
                        map={this.state.map}
                        visiblePins={visiblePins}
                        addPin={this.addPin}
                        changePins={this.changePins}
                        deletePin={this.deletePin}
                        directions={this.state.directions}
                        leftBar={this.state.leftBar}
                        updateMapSettings={this.updateMapSettings}
                        showInLeftBar={this.showInLeftBar}
                        animatedId={this.state.animatedId}
                    />
                </div>
            );
        }
        return null;
    }
}
