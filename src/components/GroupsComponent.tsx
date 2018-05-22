import React from 'react';
import { Button } from 'react-bootstrap';
import * as ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import { PinData } from '../types/PinData';
import { addPin } from '../api/MapApi';
import { MarkerData } from '../types/MarkerData';

interface GroupsComponentState {
    visibleColors: boolean;
    gotPins: PinData[];
    mapId: any;
}

export default class GroupsComponent extends React.Component<{mapId: any}, GroupsComponentState> {
    constructor(props: {mapId: any}) {
        super(props);
        this.showColors = this.showColors.bind(this);
        this.hideColors = this.hideColors.bind(this);
        this.handleRed = this.handleRed.bind(this);
        this.handlePink = this.handlePink.bind(this);
        this.handleColor = this.handleColor.bind(this);
        this.handleGreen = this.handleGreen.bind(this);
        this.handleBlue = this.handleBlue.bind(this);
        this.handleYellow = this.handleYellow.bind(this);
        this.handlePurple = this.handlePurple.bind(this);

        this.state = {
            gotPins: [],
            visibleColors: false,
            mapId: this.props.mapId,
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
        this.handleColor('http://maps.google.com/mapfiles/ms/icons/red.png');
    }

    handlePink(event: any) {
        this.handleColor('http://maps.google.com/mapfiles/ms/icons/pink.png');
    }

    handleYellow(event: any) {
        this.handleColor('http://maps.google.com/mapfiles/ms/icons/yellow.png');
    }

    handlePurple(event: any) {
        this.handleColor('http://maps.google.com/mapfiles/ms/icons/purple.png');
    }

    handleBlue(event: any) {
        this.handleColor('http://maps.google.com/mapfiles/ms/icons/blue.png');
    }

    handleGreen(event: any) {
        this.handleColor('http://maps.google.com/mapfiles/ms/icons/green.png');
    }

    handleColor(color: string) {

        var marker: MarkerData = {
            position: new google.maps.LatLng(70.22, 60.44),
            isWindowOpened: false,
            groupName: color,
        };

        var marker2: MarkerData = {
            position: new google.maps.LatLng(70.22, 50.44),
            isWindowOpened: false,
            groupName: color,
        };

        var marker3: MarkerData = {
            position: new google.maps.LatLng(70.22, 20.44),
            isWindowOpened: false,
            groupName: color,
        };

        var pin1: PinData = {
            data: marker,
            id: 5,
        };

        var pin2: PinData = {
            data: marker2,
            id: 6,
        };

        var pin3: PinData = {
            data: marker3,
            id: 7,
        };

        addPin(this.state.mapId, pin1, function (pin: PinData) {
            console.log('pin1 added');
            console.log(pin);
        });


        addPin(this.state.mapId, pin2, function (pin: PinData) {
            console.log('pin1 added');
        });

            addPin(this.state.mapId, pin3, function (pinb: PinData) {
                console.log('pin1 added');
            });



    }

    render() {
        let colors;
        if (this.state.visibleColors) {
            colors = (
                <div className={'OpenedColors'}>
                    <Button onClick={this.hideColors}>Hide</Button>
                    <ButtonToolbar>
                        <Button onClick={this.handleRed}>Red</Button>
                        <Button onClick={this.handlePink}>Pink</Button>
                        <Button>Blue</Button>
                        <Button>Green</Button>
                    </ButtonToolbar>
                </div>
            );
        }
        return (
            <div>
                {colors}
                <Button onClick={this.showColors}>New group
                </Button>
            </div>);
    }

}
