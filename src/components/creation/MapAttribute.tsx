import * as React from 'react';
import { Button, Modal, Col, FormControl } from 'react-bootstrap';
import { Route } from 'react-router-dom';

import { BasicAttr } from '../../types/creation/BasicAttr';
import {  FormGroup, Form } from 'reactstrap';

interface MapAttributeState {
    types: String[];
    inputs: BasicAttr[];
}

export default class MapAttribute extends React.Component<any, MapAttributeState> {

    constructor(props: any) {
        super(props);

        this.state = {
            inputs : this.props.simpleAttr,
            types: [ 'm^2', 'pln', 'yes/no', 'text', 'number', 'other']
        };
        this.handlePrepareInputs = this.handlePrepareInputs.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handlePrepareInputs(isNew: boolean) {
        let len = this.state.inputs.length;
        if ( len === 0 || len < 5) {
            let temp: BasicAttr[];
            temp = [];
            for (let i = 0; i < (5 - len); i++) {
                temp.push({name: '', type: ''});
            }
            this.setState({
                inputs: this.state.inputs.concat(temp)
            });
        } else if (isNew) {
            this.setState((prevState: any) => ({
                inputs: [...prevState.inputs, {name: '', type: ''}]
            }));

        }
    }

    handleChange (evt: any, index: any, fieldName: any) {
        this.state.inputs[index][fieldName] = evt.target.value;
        this.forceUpdate();
    }

    render() {
        return(
            <div className="static-modal">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title> Hello in MapNotes </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form >
                        {
                            this.handlePrepareInputs(false)
                        }
                        {this.state.inputs.map((input: any, index: any) =>
                            <div className="form-inline" key={index}>
                                <FormGroup>
                                    <Col sm={10}>
                                        <FormControl
                                            onChange={(evt: any) => this.handleChange(evt, index, 'name')}
                                            type="string"
                                            placeholder="Name of your new attribute"
                                            value={input.name}

                                        />
                                    </Col>
                                </FormGroup>

                                <label>
                                    <select onClick={(evt) => this.handleChange(evt, index, 'type')}>
                                        <option title={input.type}>{input.type}</option>
                                        {
                                            this.state.types.map(function (type: any) {
                                                return <option
                                                    key={type.toString()}
                                                    value={type.toString()}
                                                >
                                                    {type.toString()}
                                                </option>;
                                            })
                                        }

                                    </select>
                                </label>
                            </div>
                        )}
                    </Form>

                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => this.handlePrepareInputs(true)} bsSize="small">Add new input</Button>

                    <Route
                        render={({history}) => {
                            return (
                                <Button
                                    className="closeMapAttrButton"
                                    onClick={() => history.push('/')}
                                >
                                    Close
                                </Button>
                            );
                        }}
                    />
                    <Button
                        onClick={(evt) => this.props.handleSubmit(evt, this.state.inputs)}
                        bsStyle="primary"
                    >
                        Save changes
                    </Button>
                    <Button onClick={() => this.props.handleAddComplexAttr(this.state.inputs)} bsStyle="primary">
                        AddComplexAttr</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>);
    }

}