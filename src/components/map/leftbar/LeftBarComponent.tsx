import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { TransportComponent } from './TransportComponent';
import { GroupsComponent } from './GroupsComponent';
import FilterComponent from './FilterComponent';
import { Filter } from '../../../types/filter/Filter';
import { PinData } from '../../../types/api/PinData';
import { Link } from 'react-router-dom';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import '../../../styles/map/leftbar/LeftBarComponent.css';
import { FilterListComponent } from './FilterListComponent';
import { exportToCSV } from '../../../utils/csv/csvConverter';
import { MapData } from '../../../types/api/MapData';

export interface LeftBarComponentProps {
    filter: (filter: Filter) => void;
    removeFilter: () => void;
    showRoadBetweenMarkers: (result: any) => void;
    visiblePins: PinData[];
    changePins: (pins: PinData[]) => void;
    deleteMap: () => void;
    callbackOnRef: any;
    showInLeftBar: (component: any) => void;
    leftBarComponentChild?: any;
    map: MapData;
}

export interface LeftBarState {
    visibleLeftBar: boolean;
}

export class LeftBarComponent extends React.Component<LeftBarComponentProps, LeftBarState> {

    references: {transportComponent: any; } =
        {transportComponent: null};

    constructor(props: LeftBarComponentProps) {
        super(props);
        this.state = {
            visibleLeftBar: false,
        };
        this.showLeftBar = this.showLeftBar.bind(this);
        this.hideLeftBar = this.hideLeftBar.bind(this);
    }

    componentDidMount() {
        this.props.callbackOnRef(this);
    }

    componentWillUnmount() {
        this.props.callbackOnRef(null);
    }

    showLeftBar() {
        this.setState(
            {
                visibleLeftBar: true,
            });
    }

    hideLeftBar() {
        this.setState({
            visibleLeftBar: false
        });
    }

    renderBody() {
        if (this.props.leftBarComponentChild) {
            return (
                <div className="OpenedLeftBar">
                    <div className="LeftBarContent" >
                        <div className="LeftBarChild">
                            {this.props.leftBarComponentChild}
                        </div>
                    </div>
                </div>
            );
        }
        if (this.state.visibleLeftBar) {
            return (
                <div className="OpenedLeftBar">
                    <div className="LeftBarContent" >
                        <div className="NavButtons Buttons">
                            <Button
                                className="DeleteMapButton btn btn-danger"
                                onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete map?')) {
                                        this.props.deleteMap();
                                    }
                                }}
                            >
                                Delete Map
                            </Button>
                            <Link to="/home">
                                <Button
                                    className="btn btn-success"
                                >
                                    Home
                                </Button>
                            </Link>
                            <Button
                             className="ExportButton"
                             onClick={() => exportToCSV(this.props.map)}
                            >
                                Export to CSV
                            </Button>
                            <Button
                                className="CloseLeftBarButton btn btn-primary"
                                onClick={this.hideLeftBar}
                            >
                                <Glyphicon glyph="remove"/>
                            </Button>
                        </div>
                        <Panel id="Transport" defaultExpanded={true}>
                            <Panel.Heading>
                                <Panel.Title toggle={true}>
                                    Transport
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <TransportComponent
                                        onRef={(ref: any) => (this.references.transportComponent = ref)}
                                        showRoadBetweenMarkers={this.props.showRoadBetweenMarkers}
                                        visiblePins={this.props.visiblePins}
                                    />
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="Filter" defaultExpanded={true}>
                            <Panel.Heading>
                                <Panel.Title toggle={true}>
                                    Filter
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <FilterComponent
                                        filter={this.props.filter}
                                        removeFilter={this.props.removeFilter}
                                    />
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="FilterList" defaultExpanded={true}>
                            <Panel.Heading>
                                <Panel.Title toggle={true}>
                                    Pins
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <FilterListComponent
                                        visiblePins={this.props.visiblePins}
                                    />
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                        <Panel id="Group" defaultExpanded={true}>
                            <Panel.Heading>
                                <Panel.Title toggle={true}>
                                    Group
                                </Panel.Title>
                            </Panel.Heading>
                            <Panel.Collapse>
                                <Panel.Body>
                                    <GroupsComponent
                                        changePins={this.props.changePins}
                                        visiblePins={this.props.visiblePins}
                                    />
                                </Panel.Body>
                            </Panel.Collapse>
                        </Panel>
                    </div>
                </div>
            );
        }
        return (
            <div className="ClosedLeftBar">
                <div className="LeftBarContent" >
                    <Button
                        className="btn btn-primary"
                        onClick={this.showLeftBar}
                    >
                        <Glyphicon glyph="menu-hamburger"/>
                    </Button>
                </div>
            </div>
        );
    }

    render() {
        return(
            <div className="LeftBar">
                {this.renderBody()}
            </div>
        );
    }
}