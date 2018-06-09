import * as React from 'react';
import '../styles/App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CreationMenu } from './creation/CreationMenu';
import { MapMenu } from './map/MapMenu';
import { HomeMenu } from './home/HomeMenu';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ChooseRouterPathComponent } from './ChooseRouterPathComponent';

export class App extends React.Component<{}, {}> {

    render() {
        return (
            <Router>
                <div className="container">
                    <Route path="/map/:id" component={MapMenu}/>
                    <Route path="/create" component={CreationMenu}/>
                    <Route path="/home" component={HomeMenu}/>
                    <Route exact={true} path="/" component={ChooseRouterPathComponent}/>
                </div>
            </Router>
        );
    }
}
