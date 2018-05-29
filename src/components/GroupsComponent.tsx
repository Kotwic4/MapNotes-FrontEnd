import React from 'react';
import { Button } from 'react-bootstrap';
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import { PinData } from '../types/PinData';
import { addPin } from '../api/MapApi';
import { MarkerData } from '../types/MarkerData';
import '../styles/GroupsStyle.css';
import MapContainer from './MapComponent';
import ReactDOM from 'react-dom';

interface GroupsComponentProps {
    shownMarkers: PinData[];
    mapId: any;
}

interface GroupsComponentState {
    visibleColors: boolean;
    gotPins: PinData[];
    mapId: any;
    buttonClicked: boolean;
}

export default class GroupsComponent extends React.Component<GroupsComponentProps , GroupsComponentState> {
    constructor(props: GroupsComponentProps ) {
        super(props);
        this.showColors = this.showColors.bind(this);
        this.hideColors = this.hideColors.bind(this);
        this.handleRed = this.handleRed.bind(this);
        this.handlePink = this.handlePink.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.handleGreen = this.handleGreen.bind(this);
        this.handleBlue = this.handleBlue.bind(this);
        this.handleYellow = this.handleYellow.bind(this);
        this.myCallback = this.myCallback.bind(this);

        this.state = {
            gotPins: [],
            visibleColors: false,
            mapId: this.props.mapId,
            buttonClicked: false,
        };
    }

    showColors(event: any) {
        this.setState(
            {
                visibleColors: true,
            });
    }

    hideColors(event: any) {
        this.setState(
            {
                visibleColors: false,
            });
    }

    handleRed(event: any) {
        this.handleColor('red');
    }

    handlePink(event: any) {
        this.handleColor('pink');
    }

    handleYellow(event: any) {
        this.handleColor('yellow');
    }

    handleBlue(event: any) {
        this.handleColor('blue');
    }

    handleGreen(event: any) {
        this.handleColor('green');
    }

    handleColor(color: string) {

        for (let gotPin of this.props.shownMarkers) {
            var marker: MarkerData = {
                position: gotPin.data.position,
                isWindowOpened: false,
                groupName: color,
                attributes: {},
            };

            var pin1: PinData = {
                data: marker,
                id: gotPin.id
            };

            addPin(this.state.mapId, pin1, this.myCallback);
        }

    }

    myCallback ( pin: PinData) {

        console.log('added pin1');
        console.log(pin);
        this.setState({buttonClicked: true});
    }
    renderMap() {
        ReactDOM.render(<MapContainer mapId={this.props.mapId}/>, document.getElementById('root'));
    }

    render() {
        let colors;
        if (this.state.visibleColors) {
            colors = (
                <div className={'OpenedColors'}>
                    <Button onClick={this.hideColors}>Hide</Button>
                    <ButtonToolbar>
                        <Button bsClass="redButton" onClick={this.handleRed}>Red</Button>
                        <Button bsClass="pinkButton" onClick={this.handlePink}>Pink</Button>
                        <Button bsClass="greenButton" onClick={this.handleGreen}>Green</Button>
                        <Button bsClass="yellowButton" onClick={this.handleYellow}>Yellow</Button>
                        <Button bsClass="blueButton" onClick={this.handleBlue}>Blue</Button>
                    </ButtonToolbar>
                </div>
            );
        }
        if ( this.state.visibleColors && this.state.buttonClicked ) {
           console.log('jestem tutaj');
           this.setState({buttonClicked: false});
           this.renderMap();
        }
        return (
            <div className={'groups'}>
                {colors}
                <Button onClick={this.showColors}>New group
                </Button>
            </div>);
    }

}