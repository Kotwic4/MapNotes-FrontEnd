/* global google */
import '../../styles/map/Map.css';
import * as React from 'react';
import { compose } from 'recompose';
import { GoogleMap, withGoogleMap, withScriptjs, DirectionsRenderer } from 'react-google-maps';
import { MarkerComponent } from './marker/MarkerComponent';
import { WithScriptjsProps } from 'react-google-maps/lib/withScriptjs';
import { WithGoogleMapProps } from 'react-google-maps/lib/withGoogleMap';
import { GOOGLE_MAP_URL } from '../../constants';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { MapData } from '../../types/api/MapData';
import { PinData } from '../../types/api/PinData';
import { MapSettings } from '../../types/map/MapSettings';

export interface MapProps {
    markers: any;
    directions: any;
    onMapClick: (e: google.maps.MouseEvent) => void;
    defaultCenter: google.maps.LatLngLiteral;
    defaultZoom: number;
    handleMapMounted: any;
    handleSearchBoxMounted: any;
    onBoundsChanged: any;
    onPlacesChanged: any;
    bounds: any;
}

type MapComposeProps = WithScriptjsProps & WithGoogleMapProps & MapProps;

const MapView = compose<MapProps, MapComposeProps>(
    withScriptjs,
    withGoogleMap,
)
((props: MapProps) => {
    return (
        <GoogleMap
            defaultZoom={props.defaultZoom}
            defaultCenter={props.defaultCenter}
            onClick={props.onMapClick}
            onBoundsChanged={props.onBoundsChanged}
            ref={props.handleMapMounted}
        >
            <SearchBox
                bounds={props.bounds}
                controlPosition={google.maps.ControlPosition.TOP_LEFT}
                onPlacesChanged={props.onPlacesChanged}
                ref={props.handleSearchBoxMounted}
            >
                <input
                    type="text"
                    placeholder="Search places"
                    className="searchBoxInput"
                />
            </SearchBox>
            {props.markers}
            {props.directions && <DirectionsRenderer directions={props.directions} />}
        </GoogleMap>
    );
});

export interface MapContainerProps {
    map: MapData;
    visiblePins: PinData[];
    addPin: (pin: PinData) => void;
    changePins: (pins: PinData[]) => void;
    updateMapSettings: (mapSettings: MapSettings) => void;
    deletePin: (pin: PinData) => void;
    directions: any;
    leftBar: any;
    showInLeftBar: (component: any) => void;
}

export interface MapContainerState {
    bounds: any;
    center: any;
    newPin?: PinData;
}

export class MapContainer extends React.Component<MapContainerProps, MapContainerState> {

    references: { map: any; searchBox: any; directionsService: any; } =
        {map: null, searchBox: null, directionsService: null};

    constructor(props: MapContainerProps) {
        super(props);

        this.state = {
            bounds: null,
            center: null,
        };

        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.onBoundsChanged = this.onBoundsChanged.bind(this);
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
        this.showTransportComponent = this.showTransportComponent.bind(this);
    }

    handleMapClick(event: google.maps.MouseEvent) {
        const newPin: PinData = {
            data: {
                position: event.latLng.toJSON(),
                isWindowOpened: false,
                groupName: 'red',
                attributes: [],
            },
        };
        this.setState({newPin});
    }

    handleSearchBoxMounted(searchBox: any) {
        this.references.searchBox = searchBox;
    }

    handleMapMounted(map: any) {
        this.references.map = map;
    }

    onBoundsChanged() {
        this.setState({
            bounds: this.references.map.getBounds(),
            center: this.references.map.getCenter(),
        });
    }

    onPlacesChanged() {
        const places = this.references.searchBox.getPlaces();
        const bounds = new google.maps.LatLngBounds();
        places.forEach((place: any) => {
            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });

        const searchBoxMarkers = places.map((place: any) => ({
            position: place.geometry.location,
            isWindowOpened: false
        }));

        const newPin = {
            data: {
                position: searchBoxMarkers[0].position.toJSON(),
                isWindowOpened: false,
                groupName: 'red',
                attributes: [],
            }
        };
        this.setState({ newPin });

        this.references.map.fitBounds(bounds);
    }

    showTransportComponent() {
        this.props.leftBar.showLeftBar();
    }

    renderNewPin() {
        const pin = this.state.newPin;
        if (pin) {
            return (
                <MarkerComponent
                    pin={pin}
                    mapData={this.props.map.data}
                    index={-1}
                    key={-1}
                    savePin={this.props.addPin}
                    deletePin={() => this.setState({newPin: undefined})}
                    updateMapSettings={(mapSetting) => this.props.updateMapSettings(mapSetting)}
                    showTransportComponent={this.showTransportComponent}
                    showInLeftBar={this.props.showInLeftBar}
                />);
        }
        return null;
    }

    renderMarkers() {
        const mapMarkers = this.props.visiblePins.map((pin: PinData, index: any) => {
            return (
                <MarkerComponent
                    pin={pin}
                    mapData={this.props.map.data}
                    index={index}
                    key={index}
                    savePin={(savePin) => {
                        this.props.changePins([savePin]);
                    }}
                    updateMapSettings={(mapSetting) => this.props.updateMapSettings(mapSetting)}
                    deletePin={this.props.deletePin}
                    showTransportComponent={this.showTransportComponent}
                    showInLeftBar={this.props.showInLeftBar}
                />);
            }
        );
        return(
            <div>
                {mapMarkers}
                {this.renderNewPin()}
            </div>
        );
    }

    render() {
        const markers = this.renderMarkers();
        return (
            <MapView
                googleMapURL={GOOGLE_MAP_URL}
                loadingElement={<div style={{height: `100%`}}/>}
                containerElement={<div style={{ height: '100vh'}} />}
                mapElement={<div style={{height: `100%`}}/>}
                onMapClick={this.handleMapClick}
                markers={markers}
                directions={this.props.directions}
                defaultCenter={{lat: 50.03, lng: 19.56}}
                defaultZoom={8}
                handleMapMounted={this.handleMapMounted}
                handleSearchBoxMounted={this.handleSearchBoxMounted}
                onBoundsChanged={this.onBoundsChanged}
                bounds={this.state.bounds}
                onPlacesChanged={this.onPlacesChanged}
            />
        );
    }
}
