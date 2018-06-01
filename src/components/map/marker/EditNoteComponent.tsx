import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { AddAttributeComponent } from './AddAttributeComponent';
import Form from 'reactstrap/lib/Form';
import * as FormGroup from 'react-bootstrap/lib/FormGroup';
import Col from 'reactstrap/lib/Col';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import { MapSettings } from '../../../types/map/MapSettings';
import { PinData } from '../../../types/api/PinData';

export interface EditNoteComponentProps {
    pin: PinData;
    mapData: MapSettings;
    savePin: (pin: PinData) => void;
    deletePin: (pin: PinData) => void;
    close: () => void;
}

export interface EditNoteComponentState {
    pin: PinData;
    input: any;
    isAddNewAttrClick: boolean;
}

export class EditNoteComponent extends React.Component<EditNoteComponentProps, EditNoteComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            pin: this.props.pin,
            input: '',
            isAddNewAttrClick: false
        };
        this.handleAddingNewAttribute = this.handleAddingNewAttribute.bind(this);
    }

    handleAddingNewAttribute(name: string) {
        const pin = this.state.pin;
        pin.data.attributes[name] = undefined;
        this.setState({
            pin,
            isAddNewAttrClick: false
        });
    }

    renderAddAtributeNote() {
        if (this.state.isAddNewAttrClick) {
            return (
                <AddAttributeComponent
                    cancel={() => this.setState({isAddNewAttrClick: false})}
                    save={this.handleAddingNewAttribute}
                />
            );
        }
        return null;
    }

    handleChange (key: any, event: any) {
        const pin = this.state.pin;
        pin.data.attributes[key] = event.target.value;
        this.setState({pin});
    }

    renderModalBody() {
        const attributes = this.state.pin.data.attributes;
        const keys = Object.keys(attributes);
        return(
            <Modal.Body>
                <Form >
                    <FormGroup
                        controlId="NewNote"
                    >
                        {keys.map(key => (
                            <div key={key}>
                                <Col sm={4}>
                                    {key}
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        onChange={(event) => this.handleChange(key, event)}
                                        placeholder="Enter a value"
                                        value={attributes[key]}
                                    />
                                </Col>
                            </div>
                        ))}
                    </FormGroup>
                </Form>
                {this.renderAddAtributeNote()}
            </Modal.Body>
        );
    }

    render() {
        return(
            <div className="static-modal">
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title>Edit note</Modal.Title>
                    </Modal.Header>

                    {this.renderModalBody()}

                    <Modal.Footer>
                        <Button
                            className="btn btn-secondary"
                            onClick={() => this.setState({isAddNewAttrClick: true})}
                        >
                            Add new attribute
                        </Button>
                        <Button className="btn btn-secondary" onClick={this.props.close}>
                            Close
                        </Button>
                        <Button className="btn btn-danger" onClick={() => this.props.deletePin(this.props.pin)}>
                            Delete
                        </Button>
                        <Button className="btn btn-primary" onClick={() => this.props.savePin(this.state.pin)}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            </div>
        );
    }
}