import * as React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import * as Button from 'react-bootstrap/lib/Button';
import * as Modal from 'react-bootstrap/lib/Modal';
import * as FormGroup from 'react-bootstrap/lib/FormGroup';
import * as Col from 'react-bootstrap/lib/Col';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import { ComplexAttrType } from '../../types/creation/ComplexAttrType';
import _ from 'lodash';

interface NewComplexAttributeState {
    newComplexAttrName: string;
    newComplexAttrValue: string;
    operators: Array<string>;
    simpleAttrAvailableNames: Array<string>;
}

export default class NewComplexAttribute extends React.Component<any, NewComplexAttributeState> {

    constructor(props: any) {
        super(props);
        this.state = {
            newComplexAttrName: '',
            newComplexAttrValue: '',
            operators: ['+', '-', '*', '/'],
            simpleAttrAvailableNames: this.props.simpleAttrAvailableNames,
        };
        this.createListOfButtonsWithSimpleAttr = this.createListOfButtonsWithSimpleAttr.bind(this);
        this.createListOfButtonsWithOperands = this.createListOfButtonsWithOperands.bind(this);
        this.onChangeAttributeNameInput = this.onChangeAttributeNameInput.bind(this);
        this.onChangeAttributeValueInput = this.onChangeAttributeValueInput.bind(this);
        this.onChangeAttributeValueInputForButtons = this.onChangeAttributeValueInputForButtons.bind(this);
        this.onChangeAttributeValueInputOperatorsForButtons =
            this.onChangeAttributeValueInputOperatorsForButtons.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.isProperValueInput = this.isProperValueInput.bind(this);
        this.checkIfAttributeType = this.checkIfAttributeType.bind(this);
        this.checkIfOperator = this.checkIfOperator.bind(this);
        this.isNewAttrNameUsed = this.isNewAttrNameUsed.bind(this);
        this.deleteWhiteSigns = this.deleteWhiteSigns.bind(this);
    }

    deleteWhiteSigns() {
        let value: string = this.state.newComplexAttrValue.split(' ').join('');
        this.setState({
            newComplexAttrValue: value
        });
        console.log('without spaces');
        console.log(this.state.newComplexAttrValue);
    }

    isProperValueInput() {
        let operatorPlace: boolean = false;
        this.deleteWhiteSigns();

        if (this.state.newComplexAttrValue.length === 0 ) {
            return false;
        }

        for (let i = 0; i < this.state.newComplexAttrValue.length - 1; i++ ) {

            console.log(this.state.newComplexAttrValue[i]);
            if (this.state.newComplexAttrValue[i] === '[' && !operatorPlace) {
                let newAttr = '';
                i++;

                if (this.state.newComplexAttrValue[i] === ']') {
                    return false;
                }

                while (this.state.newComplexAttrValue[i] !== ']'
                && i <= this.state.newComplexAttrValue.length) {
                    newAttr = newAttr + this.state.newComplexAttrValue[i];
                    console.log(newAttr);
                    i++;
                }

                if (this.state.newComplexAttrValue[i] !== ']' && this.state.newComplexAttrValue.length === i) {
                    return false;
                }

                console.log(newAttr);
                operatorPlace = true;
                if (!this.checkIfAttributeType(newAttr.split(' ').join(''))) {
                    console.log('false');
                    return false;
                }
            } else if (operatorPlace) {
                operatorPlace = false;
                while (this.state.newComplexAttrValue[i] === ' ') {
                    i++;
                }

                if (!this.checkIfOperator(this.state.newComplexAttrValue[i])) {
                    console.log('false');
                    return false;
                }
                i++;
            } else {
                return false;
            }
        }
        if (!operatorPlace) {
            return false;
        }
        return true;
    }

    checkIfAttributeType(newAttr: string) {
        console.log('checking if attr type');
        console.log(newAttr);
        return (_.includes(this.state.simpleAttrAvailableNames, newAttr) || !isNaN(Number(newAttr)));
    }

    checkIfOperator(newAttr: string) {
        console.log('checking if operator');
        console.log(newAttr);
        return _.includes(this.state.operators, newAttr);
    }

    onChangeAttributeNameInput(event: any) {
        this.setState({
            newComplexAttrName: event.target.value
        });
    }

    onChangeAttributeValueInput(event: any) {
        console.log('on change value input sb types');
        console.log(event.target.value);
        this.setState({
            newComplexAttrValue: event.target.value
        });
    }

    onChangeAttributeValueInputForButtons(event: any) {
        console.log('on change value input');
        console.log(event.target.value);
        this.setState({
            newComplexAttrValue: this.state.newComplexAttrValue + '[ ' + event.target.value + ' ]'
        });
    }
    onChangeAttributeValueInputOperatorsForButtons(event: any) {
        console.log('on change value input');
        console.log(event.target.value);
        this.setState({
            newComplexAttrValue: this.state.newComplexAttrValue + ' ' + event.target.value + ' '
        });
    }

    createListOfButtonsWithSimpleAttr() {
        let simpleAttButtons = [];
        for (let i = 0; i < this.props.simpleAttr.length; i++) {
            if (this.props.simpleAttr[i].type === 'pln' || this.props.simpleAttr[i].type === 'm^2') {
                simpleAttButtons.push((
                    <Button
                        className={'simpleAttrButton'}
                        id={this.props.simpleAttr[i].name}
                        value={this.props.simpleAttr[i].name}
                        onClick={this.onChangeAttributeValueInputForButtons}
                    > {this.props.simpleAttr[i].name}
                    </Button>
                ));
            }
        }
        return simpleAttButtons;
    }

    createListOfButtonsWithOperands() {
        let operatorButtons = [];
        for ( let i = 0 ; i < this.state.operators.length ; i++ ) {
            operatorButtons.push((
                <Button
                    className={'simpleAttrButton'}
                    id={this.state.operators[i]}
                    value={this.state.operators[i]}
                    onClick={this.onChangeAttributeValueInputOperatorsForButtons}
                > {this.state.operators[i]}
                </Button>
            ));
        }
        return operatorButtons;
    }

    handleClose() {
        this.setState({
            newComplexAttrName: '',
            newComplexAttrValue: '',
        });
        console.log('close ');
        this.props.handleCloseAddNewAttrBox();
    }

    isNewAttrNameUsed() {
        let simpleNames: Array<string>  = _.map(this.props.simpleAttr, i => i.name);
        let complexNames: Array<string>  = _.map(this.props.complexAttributes, i => i.name);

        return (_.includes(simpleNames, this.state.newComplexAttrName) ||
            _.includes(complexNames, this.state.newComplexAttrName));

    }

    handleSave() {
        if (this.state.newComplexAttrName.length === 0) {
            alert('name cannot be empty!');
        } else if (this.isNewAttrNameUsed()) {
            alert('name already in use!');
        } else if (!this.isProperValueInput()) {
            alert('incorresct input !');
        } else {

            let complexAttr: ComplexAttrType = {
                'name': this.state.newComplexAttrName,
                'value': this.state.newComplexAttrValue
            };
            this.props.handleClickSaveOnComplexAttrButton(complexAttr);
            console.log('save');
            this.handleClose();
        }
    }

    render() {
        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Add new complex attribute</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className={'InfoComplexAttr'}>
                            Complex Attributes should have the following pattern:
                            [basic-attr]/[number] operator [basic-attr]/[number]
                        </div>
                        <FormGroup className={'complexAttributeModalBody'}>
                            <Col sm={10}> Attribute name
                                <FormControl
                                    placeholder="attribute name"
                                    onChange={this.onChangeAttributeNameInput}
                                />
                            </Col>
                            <Col sm={10}> Attribute value
                                <FormControl
                                    value={this.state.newComplexAttrValue}
                                    onChange={this.onChangeAttributeValueInput}
                                />
                            </Col>
                            <Col  sm={10} className={'operatorButtonList'}>
                                {this.createListOfButtonsWithOperands()}
                            </Col>
                            <Col  sm={10} className={'simpleAttrButtonList'}>
                                {this.createListOfButtonsWithSimpleAttr()}
                            </Col>
                        </FormGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleClose}>Close</Button>
                        <Button
                            onClick={this.handleSave}
                            bsStyle="primary"
                        >Save changes
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }

}