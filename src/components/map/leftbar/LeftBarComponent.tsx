import React from 'react';
import { Button } from 'react-bootstrap';
import { TransportComponent } from './TransportComponent';
import { GroupsComponent } from './GroupsComponent';

import FilterComponent from './FilterComponent';
import { Filter } from '../../../types/filter/Filter';
import { PinData } from '../../../types/api/PinData';
import { Link } from 'react-router-dom';

export interface LeftBarComponentProps {
    filter: (filter: Filter) => void;
    removeFilter: () => void;
    showRoadBetweenMarkers: (result: any) => void;
    visiblePins: PinData[];
    changePins: (pins: PinData[]) => void;
    deleteMap: () => void;
}

export interface LeftBarState {
    visibleLeftBar: boolean;
}

export class LeftBarComponent extends React.Component<LeftBarComponentProps, LeftBarState> {

    constructor(props: LeftBarComponentProps) {
        super(props);
        this.state = {
            visibleLeftBar: false,
        };
        this.showLeftBar = this.showLeftBar.bind(this);
        this.hideLeftBar = this.hideLeftBar.bind(this);
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

    render() {
       if (this.state.visibleLeftBar) {
           return (
               <div className="OpenedLeftBar">
                   <div>
                       <Button
                           className="CloseLeftBarButton"
                           onClick={this.hideLeftBar}
                       >
                           hide BAR
                       </Button>
                   </div>
                   <div>
                       <Button
                           className="DeleteMapButton"
                           onClick={this.props.deleteMap}
                       >
                           Delete Map
                       </Button>
                   </div>
                   <Link to="/">
                       <Button
                           className="HomeButton"
                       >
                           Home
                       </Button>
                   </Link>
                   <TransportComponent
                       showRoadBetweenMarkers={this.props.showRoadBetweenMarkers}
                       visiblePins={this.props.visiblePins}
                   />
                   <FilterComponent
                       filter={this.props.filter}
                       removeFilter={this.props.removeFilter}
                   />
                   <GroupsComponent
                       changePins={this.props.changePins}
                       visiblePins={this.props.visiblePins}
                   />
               </div>
            );
        }
        return (
            <div className={'ClosedLeftBar'}>
                <button
                    className={'OpenLeftBarButton'}
                    onClick={this.showLeftBar}
                > open BAR
                </button>
            </div>
        );
    }
}