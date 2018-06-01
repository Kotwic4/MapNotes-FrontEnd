import * as React from 'react';
import { Button } from 'react-bootstrap';
import { FormGroup, FormControl, Form, Col, ControlLabel,
    MenuItem, DropdownButton } from 'react-bootstrap/lib';
import { TYPES } from '../../../constants';

export interface AddAttributeComponentProps {
    cancel: () => void;
    save: (name: string) => void;
}

export interface AddAttributeComponentState {
    selected: String;
    isDefault: boolean;
    name: string;
}

export class AddAttributeComponent extends React.Component<AddAttributeComponentProps, AddAttributeComponentState> {

    constructor(props: any) {
        super(props);
        this.state = {
            selected: 'Choose type',
            isDefault: false,
            name: ''
        };
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleNameEnter = this.handleNameEnter.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleTypeChange(event: any) {
        this.setState({selected: event.toString()});
    }

    handleCheckbox(event: any) {
        this.setState({
            isDefault: !this.state.isDefault
        });

    }

    handleSave() {
        if (this.getValidationStateName() === 'success' && this.getValidationStateType() === 'success') {
            this.props.save(this.state.name);
        } else {
            alert('Fill out all mandatory fields');
        }
    }

    handleNameEnter(event: any) {
        this.setState({
            name: event.target.value
        });
    }

    getValidationStateName() {
        const length = this.state.name.length;
        if (length > 2) {
            return 'success';
        } else if (length < 1) {
            return 'error';
        }
        return null;
    }

    getValidationStateType() {
        if (this.state.selected === 'Choose type') {
            return 'error';
        } else {
            return 'success';
        }
    }

    render() {
        return(
            <div>
                <Form horizontal={true}>
                    <FormGroup
                        controlId="NewAttrName"
                        validationState={this.getValidationStateName()}
                    >
                        <Col componentClass={ControlLabel} sm={2}>
                            Name
                        </Col>
                        <Col sm={10}>
                            <FormControl
                                onChange={this.handleNameEnter}
                                type="string"
                                placeholder="Name of your new attribute"
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup
                        controlId="newAttrType"
                        validationState={this.getValidationStateType()}
                    >
                        <Col componentClass={ControlLabel} sm={2}>
                            Type
                        </Col>
                        <Col sm={4}>
                            <DropdownButton
                                onSelect={this.handleTypeChange}
                                title={this.state.selected}
                                id="dropdown-size-medium"
                            >
                                {
                                    TYPES.map(function(type: any) {
                                        return (
                                            <MenuItem key={type} eventKey={type.toString()}>
                                                {type.toString()}
                                            </MenuItem>);
                                    })
                                }
                            </DropdownButton>
                        </Col>
                    </FormGroup>
                </Form>
                <Button className="btn btn-secondary" onClick={this.props.cancel}>
                    Cancel
                </Button>
                <Button className="btn btn-primary" onClick={this.handleSave}>
                    Save
                </Button>
            </div>
        );
    }
}