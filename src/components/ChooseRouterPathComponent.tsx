import * as React from 'react';
import { Redirect } from 'react-router';
import { MAP_ID_STORAGE } from '../constants';
import { getFromStorage } from '../utils/localStorage/localStorageUtils';

export class ChooseRouterPathComponent extends React.Component<{}, {}> {

    constructor(props: {}) {
        super(props);
    }

    render() {
        const lastMapID = getFromStorage(MAP_ID_STORAGE);
        if (lastMapID) {
            return(
                <Redirect to={'/map/' + lastMapID}/>
            );
        } else {
            return(
                <Redirect to={'/home'}/>
            );
        }
    }
}