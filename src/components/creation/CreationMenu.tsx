import * as React from 'react';
import { MapData } from '../../types/api/MapData';
import { PinData } from '../../types/api/PinData';
import { putMap } from '../../api/MapApi';
import { ComplexAttrType } from '../../types/creation/ComplexAttrType';
import { BasicAttrType } from '../../types/BasicAttrType';
import { OPERATORS } from '../../constants/index';
import { FormulaLists } from '../../types/creation/FormulaLists';
import _ from 'lodash';
import CreateAttributeComponent from './CreateAttributeComponent';

interface CreationMenuState {
    isNewMapClicked: boolean;
    isOpen: boolean;
}

export class CreationMenu extends React.Component <any, CreationMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isNewMapClicked : false,
            isOpen : false,
        };

        this.myCallback = this.myCallback.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleCloseAttr = this.handleCloseAttr.bind(this);
        this.handleSaveAttr = this.handleSaveAttr.bind(this);
    }

    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen,
            isNewMapClicked: !this.state.isNewMapClicked
        });
    }

    handleCloseAttr() {
        this.toggleModal();
        this.props.history.push('/');
    }

    getAttrList(value: string) {
        value = value.split(' ').join('');
        const args = value.split(/\[|\]/ );
        return args.filter(i => !_.includes(OPERATORS, i) && i !== '');
    }

    getOperatorList(value: string) {
        value = value.split(' ').join('');
        const args = value.split(/\[|\]/);
        return args.filter(i => _.includes(OPERATORS, i));
    }

    prepareComplexAttr(complexAttributes: Array<ComplexAttrType>) {
        const complexAttrMap: Array<FormulaLists> = [];
        complexAttributes.map(i => complexAttrMap.push(
            {
                'name': i.name,
                'attrList': this.getAttrList(i.value),
                'opList': this.getOperatorList(i.value)

            }
        ));
        return complexAttrMap;
    }

    handleSaveAttr(basicAttributes: Array<BasicAttrType>, complexAttributes: Array<ComplexAttrType>) {
        const pin: PinData[] = [];

        const map: MapData = {
            data: {
                attributes: basicAttributes,
                complexAttributes: this.prepareComplexAttr(complexAttributes)
            },
            id: 0,
            pins: pin
        };
        this.toggleModal();
        putMap(map, this.myCallback);
    }

    public myCallback(map: MapData): void {
        const path = '/map/' + map.id;
        this.props.history.push(path);
    }

    render() {
        return (
            <CreateAttributeComponent
                handleClose={this.handleCloseAttr}
                handleSave={this.handleSaveAttr}
            />
        );
    }

}
