/* global google */
import * as React from 'react';
import { compose } from 'recompose';
import { GoogleMap, withGoogleMap, withScriptjs, DirectionsRenderer } from 'react-google-maps';
import MarkerInfoWindow from './marker/MarkerInfoWindow';
import { WithScriptjsProps } from 'react-google-maps/lib/withScriptjs';
import { WithGoogleMapProps } from 'react-google-maps/lib/withGoogleMap';
import { GOOGLE_MAP_URL } from '../../constants/index';
import LeftBarComponent from './sidebar/LeftBarComponent';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { ReactElement } from 'react';
import { addPin, getMapById } from '../../api/MapApi';
import { MapData } from '../../types/api/MapData';
import { PinData } from '../../types/api/PinData';
import { Filter } from '../../types/filter/Filter';
import { MarkerData } from '../../types/map/MarkerData';

//todo Generalnie wydaje mi sie że ten plik jest duży, bo ma dużą role, przeniósłbym cześć logiki z stąd do MapMenu, aby tutaj było tylko wyświetlanie mapy


//todo to spokojnie możę pójść do css
export const INPUT_STYLE: React.CSSProperties = {
    boxSizing: `border-box`,
    border: `1px solid transparent`,
    width: `240px`,
    height: `32px`,
    marginTop: `27px`,
    padding: `0 12px`,
    borderRadius: `3px`,
    boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
    fontSize: `14px`,
    outline: `none`,
    textOverflow: `ellipses`,
};

// todo wydaje mi się że tutaj jest za dużo
interface MapProps {
    googleMapURL: String;
    markers: ReactElement<any>[];
    directions: any;
    onMapClick: (e: google.maps.MouseEvent) => void;
    defaultCenter: google.maps.LatLngLiteral;
    defaultZoom: number;
    handleMapMounted: any;
    handleSearchBoxMounted: any;
    onBoundsChanged: any;
    onPlacesChanged: any;
    bounds: any;
    onDelete: any;
    mapId: any;
}

type MapComposeProps = WithScriptjsProps & WithGoogleMapProps & MapProps;

const Map = compose<MapProps, MapComposeProps>(
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
                    style={INPUT_STYLE}
                />
            </SearchBox>
            {props.markers}
            {props.directions && <DirectionsRenderer directions={props.directions} />}
        </GoogleMap>
    );
});

interface MapContainerState {
    markers: PinData[];
    shownMarkers: PinData[];
    visibleLeftBar: boolean;
    transportInput: String;
    bounds: any;
    center: any;
    isNewMarker: boolean;
    mapId: any;
    isFilter: boolean;
    directions: any;
}

export default class MapContainer extends React.Component<{mapId: any}, MapContainerState> {

    references: {leftBarComponent: any;
        map: any; searchBox: any; directionsService: any; } =
        {leftBarComponent: null, map: null, searchBox: null, directionsService: null};

    componentDidMount() {
        console.log('Mounted');
    }

    constructor(props: {mapId: any}) {
        super(props);
        this.handleMapClick = this.handleMapClick.bind(this);
        this.handleMapMounted = this.handleMapMounted.bind(this);
        this.handleSearchBoxMounted = this.handleSearchBoxMounted.bind(this);
        this.onBoundsChanged = this.onBoundsChanged.bind(this);
        this.onPlacesChanged = this.onPlacesChanged.bind(this);
        this.undoAddedMarker = this.undoAddedMarker.bind(this);
        this.getMapByIdCallback = this.getMapByIdCallback.bind(this);
        this.filterMarkers = this.filterMarkers.bind(this);
        this.removeFilter = this.removeFilter.bind(this);
        this.showTransportComponent = this.showTransportComponent.bind(this);
        this.showRoadBetweenMarkers = this.showRoadBetweenMarkers.bind(this);

        this.state = {
            markers: [],
            shownMarkers: [],
            visibleLeftBar: false,
            transportInput: '',
            bounds: null,
            center: null,
            isNewMarker: false,
            mapId: this.props.mapId,
            isFilter: false,
            directions : null
        };
    }

    handleMapClick(event: google.maps.MouseEvent) {
        var marker: MarkerData = {
            position: new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()),
            isWindowOpened: false,
            groupName: 'red',
            attributes: {},
        };

        var pin1: PinData = {
            data: marker,
        };

        addPin(this.state.mapId, pin1, function (pin: PinData) {
            console.log(pin);
        });

        this.setState((prevState: any) => ({
            markers: [...prevState.markers, {data:
                    {position: {lat: event.latLng.lat(), lng: event.latLng.lng()},
                        groupName: 'red', attributes: {} , isWindowOpened: false }}]
        }));
        this.setState({isNewMarker : true});
    }

    handleSearchBoxMounted(searchBox: any) {
        this.references.searchBox = searchBox;
    }

    handleMapMounted(map: any) {
        getMapById(this.state.mapId, this.getMapByIdCallback);
        this.references.map = map;
    }

    public getMapByIdCallback(mapData: MapData): void {
        let gotPins = mapData.pins;

        this.setState({markers: []});

        for (let gotPin of gotPins) {
            this.setState((prevState: any) => ({
                markers: [...prevState.markers, gotPin]
            }));
        }
        this.setState({isNewMarker : true});

    }

    undoAddedMarker() {
        let array = this.state.markers;
        array.pop();
        this.setState({markers: array});
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

        const nextCenter = searchBoxMarkers.length > 0 ? searchBoxMarkers[0].position : this.state.center;
        if (!this.state.markers.some(item => item.data.position.equals(searchBoxMarkers[0].position))) {
            const newPin = {data:
                    {position: searchBoxMarkers[0].position, groupName: searchBoxMarkers[0].groupName,
                        isWindowOpened: false, attributes: {}}
            };
            this.setState(prevState => ({
                center: nextCenter,
                markers: [...prevState.markers, newPin]
            }));
        }

        this.references.map.fitBounds(bounds);
    }

    showTransportComponent(lat: any, lng: any, index: any) {
        this.references.leftBarComponent.showLeftBar();
        this.references.leftBarComponent.updateTransportComponentWithStartDestionation(index);
    }

    showRoadBetweenMarkers(result: any) {
        this.setState({
            directions: result,
        });
    }

    filterMarkers(filter: Filter) {
        console.log(filter);
        this.setState({
            shownMarkers: this.state.markers.filter((marker) => filter.doFilter(marker)),
            isFilter: true
        });
    }

    removeFilter() {
        this.setState({
            shownMarkers: [],
            isFilter: false
        });
    }

    renderMarkers() {
        if (this.state.isFilter) {
            return this.state.shownMarkers.map((marker: PinData, index: any) => (
                <MarkerInfoWindow
                    lat={marker.data.position.lat}
                    lng={marker.data.position.lng}
                    index={index}
                    key={index}
                    isNewMarker={this.state.isNewMarker}
                    closePin={this.undoAddedMarker}
                    groupName={marker.data.groupName}

                />)
            );
        } else {
            console.log(this.state.markers);
            return this.state.markers.map((marker: PinData, index: any) => (
                <MarkerInfoWindow
                    lat={marker.data.position.lat}
                    lng={marker.data.position.lng}
                    groupName={marker.data.groupName}
                    index={index}
                    key={index}
                    isNewMarker={this.state.isNewMarker}
                    closePin={this.undoAddedMarker}
                    showTransportComponent={this.showTransportComponent}
                />)
            );
        }
    }

    render() {
        const markers = this.renderMarkers();

        return (
            <div style={{height: '100%'}} >
                <LeftBarComponent
                    mapId={this.state.mapId}
                    onRef={(ref: any) => (this.references.leftBarComponent = ref)}
                    showRoadBetweenMarkers={this.showRoadBetweenMarkers}
                    markers={this.state.markers}
                    filter={this.filterMarkers}
                    removeFilter={this.removeFilter}
                />
                <Map
                    googleMapURL={GOOGLE_MAP_URL}
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{ height: '100vh' }} />}
                    mapElement={<div style={{height: `100%`}}/>}
                    onMapClick={this.handleMapClick}
                    markers={markers}
                    directions={this.state.directions}
                    defaultCenter={{lat: -34.397, lng: 150.644}}
                    defaultZoom={8}
                    handleMapMounted={this.handleMapMounted}
                    handleSearchBoxMounted={this.handleSearchBoxMounted}
                    onBoundsChanged={this.onBoundsChanged}
                    bounds={this.state.bounds}
                    onPlacesChanged={this.onPlacesChanged}
                    onDelete={this.undoAddedMarker}
                    mapId={this.state.mapId}

                />
            </div>
        );
    }
}