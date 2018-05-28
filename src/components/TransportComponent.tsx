import * as Button from 'react-bootstrap/lib/Button';
import * as React from 'react';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as ControlLabel from 'react-bootstrap/lib/ControlLabel';
import { FormGroup } from 'react-bootstrap';
import * as Col from 'react-bootstrap/lib/Col';
// import $ from 'jquery';

interface TransportState {
    travelMode: google.maps.TravelMode;
    currentDistance: any;
}

export default class TransportComponent extends React.Component<any, TransportState> {

    references: {startDestination: any; endDestination: any; directionsService: any } =
        {startDestination: null, endDestination: null, directionsService: null};

    constructor(props: {}) {
        super(props);

        this.setState({
            travelMode: google.maps.TravelMode.DRIVING,
            currentDistance: '0',
        });

        this.searchForTransport = this.searchForTransport.bind(this);
        this.onChangeDestinationInput = this.onChangeDestinationInput.bind(this);
        this.onChangeDestinationInput = this.onChangeDestinationInput.bind(this);
        this.removeTransport = this.removeTransport.bind(this);
    }

    componentDidMount() {
        this.props.onRef(this);
        this.references.directionsService = new google.maps.DirectionsService();
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    onChangeDestinationInput(index: any) {
        this.references.startDestination.value = index;
    }

    searchForTransport(event: any) {
        var startPoint: any = this.references.startDestination.value;
        var endPoint: any = this.references.endDestination.value;

        if (startPoint !== '' && endPoint !== '' && this.props.markers.length > Math.max(endPoint, startPoint)) {
            this.references.directionsService.route({
                    origin: this.props.markers[startPoint].data.position,
                    destination: this.props.markers[endPoint].data.position,
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

        const nyc = new google.maps.LatLng(this.props.markers[startPoint].data.position.lat,
            this.props.markers[startPoint].data.position.lng);
        const london =  new google.maps.LatLng(this.props.markers[endPoint].data.position.lat,
            this.props.markers[endPoint].data.position.lng);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(nyc, london);
        console.log(distance);
        console.log(document.getElementsByTagName('distance'));
        // document.getElementById("distance").value = 'Yourvalue';

    }

    removeTransport() {
        this.props.showRoadBetweenMarkers(null);
    }

    // setCurrentDistance(distance: any) {
    //     this.setState({
    //         currentDistance: distance
    //     });
    // }

    render() {
        return (
            <div className={'TransportBar'}>
                <FormGroup controlId="destinations">
                    <Col componentClass={ControlLabel} sm={8}>Select Destiantion</Col>
                    <Col sm={8}>
                        <FormControl
                            inputRef={(ref) => {this.references.startDestination = ref; }}
                            readOnly={true}
                            placeholder={'Right click on marker to start ...'}
                            onChange={this.onChangeDestinationInput}
                        />
                        <FormControl
                            inputRef={(ref) => {this.references.endDestination = ref; }}
                            placeholder="Enter index of final destination"
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
                {/*<label>*/}
                    {/*Distance:*/}
                    <i>{this.state.currentDistance}</i>
                {/*</label>*/}
            </div>
        );
    }
}