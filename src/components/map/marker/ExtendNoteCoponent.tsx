import React from 'react';
import { Button } from 'react-bootstrap';
import { MapSettings } from '../../../types/map/MapSettings';
import { PinData } from '../../../types/api/PinData';
import { EditNoteComponent } from './EditNoteComponent';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';

export interface ExtendNoteComponentProps {
    pin: PinData;
    mapData: MapSettings;
    savePin: (pin: PinData) => void;
    updatePin: (pin: PinData) => void;
    updateMapSettings: (mapSettings: MapSettings) => void;
    showInLeftBar: (component: any) => void;
    deletePin: (pin: PinData) => void;
}

export interface ExtendNoteState {
    isEditMode: boolean;
}

export class ExtendNoteComponent extends React.Component<ExtendNoteComponentProps, ExtendNoteState> {

    constructor(props: ExtendNoteComponentProps) {
        super(props);
        this.state = {
            isEditMode: false,
        };
        this.savePin = this.savePin.bind(this);
    }

    savePin(pin: PinData) {
        this.setState(
            {isEditMode: false},
            () => this.props.savePin(pin)
        );
    }

    renderPinAttributes() {
        const attributes = this.props.pin.data.attributes;
        return attributes.map(attribute => (
            <div key={attribute.name}>
                <b>{attribute.name} </b> {attribute.value}
            </div>
        ));
    }

    renderEditNote() {
        return (
            <EditNoteComponent
                pin={this.props.pin}
                mapData={this.props.mapData}
                savePin={this.savePin}
                updatePin={this.props.updatePin}
                updateMapSettings={this.props.updateMapSettings}
                close={() => this.setState({isEditMode: false})}
            />
        );
    }

    close() {
        this.props.showInLeftBar(undefined);
    }

    render() {
        if (this.state.isEditMode) {
            return this.renderEditNote();
        }
        return (
            <div>
                <div>
                    <Button
                        className="CloseLeftBarButton btn btn-primary"
                        onClick={() => this.close()}
                    >
                        <Glyphicon glyph="remove"/>
                    </Button>
                </div>
                <div>
                    {this.renderPinAttributes()}
                    <Button
                        className="btn btn-primary"
                        onClick={() => this.setState({isEditMode: true})}
                    >
                        Edit
                    </Button>
                    <Button
                        className="btn btn-primary Save"
                        onClick={() => {
                            this.props.savePin(this.props.pin);
                            this.close();
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={() => {
                            this.props.deletePin(this.props.pin);
                            this.close();
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        );
    }
}
