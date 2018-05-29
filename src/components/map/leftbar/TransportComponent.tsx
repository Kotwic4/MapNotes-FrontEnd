import * as Button from 'react-bootstrap/lib/Button';
import * as React from 'react';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as ControlLabel from 'react-bootstrap/lib/ControlLabel';
import { FormGroup } from 'react-bootstrap';
import * as Col from 'react-bootstrap/lib/Col';
import { PinData } from '../../../types/api/PinData';

export interface TransportComponentProps {
    visiblePins: PinData[];
    showRoadBetweenMarkers: (result: any) => void;
}

export interface TransportComponentState {
    travelMode: google.maps.TravelMode;
    directionsService: any;
    startDestination?: any;
    endDestination?: any;
}

export class TransportComponent extends React.Component<TransportComponentProps, TransportComponentState> {

    constructor(props: TransportComponentProps) {
        super(props);

        this.state = {
            directionsService: new google.maps.DirectionsService(),
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.searchForTransport = this.searchForTransport.bind(this);
        this.removeTransport = this.removeTransport.bind(this);
        this.changeStartPoint = this.changeStartPoint.bind(this);
        this.changeEndPoint = this.changeEndPoint.bind(this);
    }

    searchForTransport() {
        const startPoint: any = this.state.startDestination;
        const endPoint: any = this.state.endDestination;
        console.log(startPoint);

        if (startPoint !== '' && endPoint !== '' && this.props.visiblePins.length > Math.max(endPoint, startPoint)) {
            this.state.directionsService.route({
                    origin: this.props.visiblePins[startPoint].data.position,
                    destination: this.props.visiblePins[endPoint].data.position,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result: any,
                 status: any) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        this.props.showRoadBetweenMarkers(result);
                    } else {
                        console.log(`error fetching directions ${result}`);
                    }
                });
        }
    }

    changeStartPoint(event: any) {
        this.setState({
            startDestination: event.target.value
        });
    }

    changeEndPoint(event: any) {
        this.setState({
            endDestination: event.target.value
        });
    }

    removeTransport() {
        this.props.showRoadBetweenMarkers(null);
    }

    render() {
        return (
            <div className={'TransportBar'}>
                <FormGroup controlId="destinations">
                    <Col componentClass={ControlLabel} sm={8}>Select Destiantion</Col>
                    <Col sm={8}>
                        <FormControl
                            placeholder={'Right click on marker to start ...'}
                            onChange={this.changeStartPoint}
                        />
                        <FormControl
                            placeholder="Enter index of final destination"
                            onChange={this.changeEndPoint}
                        />
                    </Col>

                    <Button
                        className={'SearchTransportButton'}
                        bsSize="small"
                        active={true}
                        onClick={this.searchForTransport}
                    >SEARCH
                    </Button>
                    <Button
                        className={'RemoveTransport'}
                        bsSize="small"
                        active={true}
                        onClick={this.removeTransport}
                    >REMOVE PATH
                    </Button>
                </FormGroup>
            </div>
        );
    }
}