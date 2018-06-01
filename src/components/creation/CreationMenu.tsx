import * as React from 'react';
import MapAttr from './MapAttribute';
import { MapData } from '../../types/api/MapData';
import { PinData } from '../../types/api/PinData';
import { putMap } from '../../api/MapApi';
import ComplexAttribute from './ComplexAttribiute';
import { BasicAttr } from '../../types/creation/BasicAttr';

interface CreationMenuState {

    isNewMapClicked: boolean;
    isOpen: boolean;
    complexAttrBox: boolean;
    complexAttr: Array<ComplexAttribute>;
    simpleAttr:  BasicAttr[];
}

export class CreationMenu extends React.Component <any, CreationMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {
            isNewMapClicked : false,
            isOpen : false,
            complexAttrBox: false,
            complexAttr: [],
            simpleAttr:  []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.myCallback = this.myCallback.bind(this);
        this.renderComplexAttr = this.renderComplexAttr.bind(this);
        this.renderMapAttribute = this.renderMapAttribute.bind(this);
        this.handleAddComplexAttr = this.handleAddComplexAttr.bind(this);
        this.handleBackToSimpleAttr = this.handleBackToSimpleAttr.bind(this);
        this.handleSaveComplexAttr = this.handleSaveComplexAttr.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.getSimpleAttr = this.getSimpleAttr.bind(this);
        this.isArrayContains = this.isArrayContains.bind(this);
    }

    toggleModal() {
        this.setState({
            isOpen: !this.state.isOpen,
            isNewMapClicked: !this.state.isNewMapClicked
        });
    }

    handleSubmit(evt: any) {
        evt.preventDefault();
        const pin: PinData[] = [];

        const map: MapData = {
            data: {attributes: this.state.simpleAttr},
            id: 0,
            pins: pin
        };
        putMap(map, this.myCallback);

    }

    public myCallback(map: MapData): void {
        let path = '/map/' + map.id;
        return this.props.history.push(path);
    }

    renderMapAttribute() {
        return(
            <MapAttr
                simpleAttr={this.state.simpleAttr}
                handleSubmit={this.handleSubmit}
                handleAddComplexAttr={this.handleAddComplexAttr}

            />
        );
    }

    isArrayContains(name: String) {
        for ( let i = 0; i < this.state.simpleAttr.length; i++) {
            if (this.state.simpleAttr[i].name === name) {
                return true;
            }
                }
                return false;
    }

    getSimpleAttr(simpleAttr: BasicAttr[]) {
        let temp: BasicAttr[];
        temp = [];
        for (let i = 0; i < simpleAttr.length; i++) {
            if (simpleAttr[i].name !== '' && !this.isArrayContains(simpleAttr[i].name) ) {
                temp.push(simpleAttr[i]);
            }
        }
        return temp;
    }

    handleAddComplexAttr(simpleAttr: BasicAttr[]) {

        this.toggleModal();
        this.setState({
            simpleAttr: this.state.simpleAttr.concat(this.getSimpleAttr(simpleAttr)),
            complexAttrBox: true
        });
    }

    handleSaveComplexAttr(complexAt: Array<ComplexAttribute>) {
        this.setState({
            complexAttr: complexAt,
            complexAttrBox: false
        });

    }

    handleBackToSimpleAttr() {
        this.setState({
            isNewMapClicked: true,
            complexAttrBox: false
        });
    }

    renderComplexAttr() {
        return (
        <ComplexAttribute
            simpleAttr={this.state.simpleAttr}
            handleBackToSimpleAttr={this.handleBackToSimpleAttr}
            handleSaveComplexAttr={this.handleSaveComplexAttr}
        />
        );
    }

    render() {
        let returnFunction;
        if (this.state.complexAttrBox) {
            returnFunction = this.renderComplexAttr();
        } else {
            returnFunction = this.renderMapAttribute();
        }
        return returnFunction;
    }

}