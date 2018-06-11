import * as React from 'react';
import math from 'mathjs';
import { Button, Modal } from 'react-bootstrap';
import { AddNoteAttributeComponent } from './AddNoteAttributeComponent';
import Form from 'reactstrap/lib/Form';
import * as FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import { MapSettings } from '../../../types/map/MapSettings';
import { PinData } from '../../../types/api/PinData';
import { FormulaLists } from '../../../types/creation/FormulaLists';
import { COMPLEX_ATTRIBUTE_TYPE } from '../../../constants';

export interface EditNoteComponentProps {
    pin: PinData;
    mapData: MapSettings;
    savePin: (pin: PinData) => void;
    updateMapSettings: (mapSettings: MapSettings) => void;
    updatePin: (pin: PinData) => void;
    close: () => void;
}

export interface EditNoteComponentState {
    pin: PinData;
    mapData: MapSettings;
    input: any;
    isAddNewAttrClick: boolean;
}

export class EditNoteComponent extends React.Component<EditNoteComponentProps, EditNoteComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            mapData: this.props.mapData,
            pin: this.handlePin(),
            input: '',
            isAddNewAttrClick: false
        };
        this.handleAddingNewAttribute = this.handleAddingNewAttribute.bind(this);
        this.handlePin = this.handlePin.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    findIndexForAttributeName(attributeName: string) {
        const pin = this.props.pin;
        return pin.data.attributes.findIndex(value => value.name === attributeName);
    }

    handlePin() {
        const pin = this.props.pin;
        console.log('pin', this.props.pin);
        const defaultAttr = this.props.mapData.attributes;
        defaultAttr.forEach(attribute => {
            const index = this.findIndexForAttributeName(attribute.name);
            if (index === -1) {
                pin.data.attributes.push({name: attribute.name, type: attribute.type, value: ''});
            }
        });

        const complexAttr = this.props.mapData.complexAttributes;

        complexAttr.forEach(complexAttribute => {
            const index = this.findIndexForAttributeName(complexAttribute.name);
            if (index === -1) {
                pin.data.attributes.push({name: complexAttribute.name, type: COMPLEX_ATTRIBUTE_TYPE, value: ''});
            }
        });

        return pin;
    }

    countComplexAttributeValue(complexAttributeValue: FormulaLists) {
        const pin = this.state.pin;
        const simpleAttributeNames = complexAttributeValue.attrList;
        const operations = complexAttributeValue.opList;

        let mathOperation: string = '';

        simpleAttributeNames.forEach( (simpleAttributeName: string) => {
            const index = this.findIndexForAttributeName(simpleAttributeName);
            mathOperation += pin.data.attributes[index].value + ' ';
            let nextOperator = operations.shift();
            if (nextOperator !== undefined) {
                mathOperation += nextOperator  + ' ';
            }
        });
        return math.eval(mathOperation);
    }

    handleComplexAttributes() {
        const pin = this.state.pin;

        const complexAttr = this.props.mapData.complexAttributes;

       complexAttr.forEach( complexAttribute => {
            const index = this.findIndexForAttributeName(complexAttribute.name);
            pin.data.attributes[index].value = this.countComplexAttributeValue(complexAttribute);
        });

        this.setState({pin});
    }

    handleAddingNewAttribute(nameAttr: string, typeAttr: string, isDefault: boolean) {
        const pin = this.state.pin;
        if (isDefault) {
            const mapAttr = this.state.mapData;
            mapAttr.attributes.push({name: nameAttr, type: typeAttr});
            this.props.updateMapSettings(mapAttr);
        }
        const newValue = {name: nameAttr, type: typeAttr, value: ''};
        const index = pin.data.attributes.findIndex(value => value.name === nameAttr);
        if (index !== -1) {
            pin.data.attributes[index] = newValue;
        } else {
            pin.data.attributes.push(newValue);
        }
        this.setState({
            pin,
            isAddNewAttrClick: false
        });
    }

    renderAddAttributeNote() {
        if (this.state.isAddNewAttrClick) {
            return (
                <AddNoteAttributeComponent
                    cancel={() => this.setState({isAddNewAttrClick: false})}
                    save={this.handleAddingNewAttribute}
                />
            );
        }
        return null;
    }

    handleChange (key: any, event: any) {
        const pin = this.state.pin;
        pin.data.attributes.forEach((value, index, attributes) => {
            if (value.name === key) {
                value.value = event.target.value;
                attributes[index] = value;
            }
        });
        this.setState({pin});
    }

    isBasicType(attributeType: any) {
        return attributeType.type !== COMPLEX_ATTRIBUTE_TYPE;
    }

    renderModalBody() {
        const attributes = this.state.pin.data.attributes;
        return(
            <Modal.Body>
                <Form >
                    <FormGroup
                        controlId="NewNote"
                    >
                        {attributes.filter(this.isBasicType).map(attribute => (
                            <div key={attribute.name}>
                                <Col sm={4}>
                                    {attribute.name}
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        onChange={(event) => this.handleChange(attribute.name, event)}
                                        placeholder="Enter a value"
                                        value={attribute.value}
                                    />
                                </Col>
                            </div>
                        ))}
                    </FormGroup>
                </Form>
                {this.renderAddAttributeNote()}
            </Modal.Body>
        );
    }

    deleteEmptyInputs() {
        const pin = this.state.pin;
        console.log('pin11', this.props.pin);
        pin.data.attributes = pin.data.attributes.filter(attr => {
                return((attr.value !== '' && this.isBasicType(attr.type)) || !this.isBasicType(attr.type));
        }
             );
        this.setState({
            pin,
            isAddNewAttrClick: false
        });
    }

    handleCancel() {
        // const pin = this.state.pin;
        // const attr = this.props.backupPin;
        // pin.data.attributes = attr;
        // console.log('pin22', pin);
        // console.log('pinB22', this.props.backupPin);
        // this.setState({pin});
        console.log('pinCancel');
        this.props.updatePin(this.state.pin);
        this.forceUpdate();
        // this.props.savePin(this.props.backupPin);

    }

    render() {
        return(
            <div>
                <Modal.Title>Edit note</Modal.Title>

                {this.renderModalBody()}

                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => this.setState({isAddNewAttrClick: true})}
                    >
                        Add new attribute
                    </Button>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => {
                            this.handleCancel();
                            // this.deleteEmptyInputs();
                            this.props.close();
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={this.handleSave}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </div>
        );
    }

    isAttributeNumber(attribute: any) {
        return((attribute.type === 'pln' || attribute.type === 'number'  || attribute.type === 'm^2')
            && isNaN(Number(attribute.value)) );
    }

    handleSave() {

        const pin = this.state.pin;
        const emptyDefaultAttr: string[] = [];
        const mismatchType: any[] = [];
        const emptyAttrWarning: string[] = [];

        const isBoolean = ((type: string) =>  {
            return(type === 'yes' || type === 'no');
        });
        pin.data.attributes.forEach((attr) => {
            if (attr.value === '' && this.isBasicType(attr) )  {
                if (this.checkIfDefault(attr.name)) {
                    emptyDefaultAttr.push(attr.name);
                } else {
                    emptyAttrWarning.push(attr.name);
                }
            } else if (this.isAttributeNumber(attr)) {
                    mismatchType.push({name: attr.name, type: attr.type});

            } else if (attr.type === 'yes/no' && !isBoolean(attr.value.toLowerCase())) {
                mismatchType.push({name: attr.name, type: attr.type});
            }

        });
        if (emptyDefaultAttr.length === 0 && mismatchType.length === 0) {
            let warningStatement = '';
            if (emptyAttrWarning.length !== 0) {
                warningStatement = '\nAdditional attributes (' + emptyAttrWarning + ' )in the note are incomplete.' +
                    ' Attributes will be deleted.';
            }
            if (confirm('Are you sure you want to save?' + warningStatement)) {

                if (warningStatement.length !== 0 ) {
                    this.deleteEmptyInputs();
                }
                this.handleComplexAttributes();
                this.props.savePin(this.state.pin);
            }

        } else {
            let errorStatement = '';
            if (emptyDefaultAttr.length !== 0) {
                errorStatement += 'Default attributes ( ' + emptyDefaultAttr + ' ) must be filled out. \n';
            }
            if (mismatchType.length !== 0) {
                mismatchType.forEach(e => {
                    errorStatement += 'The value of attribute ' + e.name + ' has incompatible type. ' +
                        'Require - ' + e.type + '.\n';
                });
            }
            alert(errorStatement);
        }
    }

    checkIfDefault(name: string) {
        const defaults = this.props.mapData.attributes.map(e => e.name);
        const isDefault = defaults.filter(e => e === name );
        return isDefault.length;
    }
}
