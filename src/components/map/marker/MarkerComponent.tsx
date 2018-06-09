import * as React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import { PinData } from '../../../types/api/PinData';
import { MapSettings } from '../../../types/map/MapSettings';
import { BASE_ICON_URL } from '../../../constants';
import { ExtendNoteComponent } from './ExtendNoteCoponent';

export interface MarkerComponentProps {
    pin: PinData;
    mapData: MapSettings;
    index: any;
    key: any;
    savePin: (pin: PinData) => void;
    updateMapSettings: (mapSettings: MapSettings) => void;
    deletePin: (pin: PinData) => void;
    showTransportComponent: (index: any) => void;
    showInLeftBar: (component: any) => void;
}

export interface MarkerComponentState {
    isMouseOver: boolean;
    isDetailOpen: boolean;
}

export class MarkerComponent extends React.Component<MarkerComponentProps, MarkerComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isMouseOver: false,
            isDetailOpen: false,
        };
        this.savePin = this.savePin.bind(this);
    }

    savePin(pin: PinData) {
        this.setState(
            () => this.props.savePin(pin)
        );
    }

    renderPinAttributes() {
        const defaults = this.props.mapData.attributes.map(e => e.name);
        const attributes = this.props.pin.data.attributes.filter(e => defaults.find(d => d === e.name));
        return attributes.map(attribute =>
            (
                <div key={attribute.name}>
                    <b>{attribute.name} </b> {attribute.value}
                </div>
            )
        );
    }

    handleMouseClick() {
        this.setState({ isDetailOpen: true },
            () => this.props.showInLeftBar(this.renderExtendNote())
        );
    }

    renderExtendNote() {
        return(
            <ExtendNoteComponent
                pin={this.props.pin}
                mapData={this.props.mapData}
                savePin={this.savePin}
                updateMapSettings={this.props.updateMapSettings}
                showInLeftBar={this.props.showInLeftBar}
                deletePin={this.props.deletePin}
            />
        );
    }

    renderSmallNote() {
        return(
            <InfoWindow onCloseClick={() => this.setState({isDetailOpen: false})}>
                <div>
                    <b>
                        Pin note
                    </b>
                    {this.renderPinAttributes()}
                </div>
            </InfoWindow>
        );
    }

    renderNote() {
        if (this.state.isDetailOpen || this.state.isMouseOver ) {
            return this.renderSmallNote();
        }
        return null;
    }

    render() {
        const position = this.props.pin.data.position;
        const iconURL = BASE_ICON_URL + this.props.pin.data.groupName + '.png';
        const index = this.props.index;
        const label = index !== -1 ? index.toString() : '';
        return(
            <Marker
                key={index}
                position={position}
                icon={iconURL}
                label={label}
                onClick={() => this.handleMouseClick()}
                onMouseOver={() => this.setState({isMouseOver: true})}
                onMouseOut={() => this.setState({isMouseOver: false})}
                onRightClick={() => this.props.showTransportComponent(this.props.index)}
            >
                {this.renderNote()}
            </Marker>
        );
    }
}
