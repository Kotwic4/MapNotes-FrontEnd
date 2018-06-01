import * as Button from 'react-bootstrap/lib/Button';
import * as React from 'react';
import * as FormControl from 'react-bootstrap/lib/FormControl';
import * as ControlLabel from 'react-bootstrap/lib/ControlLabel';
import { FormGroup } from 'react-bootstrap';
import * as Col from 'react-bootstrap/lib/Col';
import { Filter } from '../../../types/filter/Filter';
import { parseFilterInput } from '../../../utils/filter/parseFilterInput';

interface FilterState {
    input: string;
}

interface FilterComponentProps {
    filter: (filter: Filter) => void;
    removeFilter: () => void;
}

export default class FilterComponent extends React.Component<FilterComponentProps, FilterState> {

    constructor(props: FilterComponentProps) {
        super(props);

        this.state = {
            input: '',
        };

        this.filter = this.filter.bind(this);
        this.onChangeFilterInput = this.onChangeFilterInput.bind(this);
    }

    onChangeFilterInput(event: any) {
        this.setState(({
            input: event.target.value
        }));
    }

    filter() {
        const input = this.state.input;
        try {
            if ( input === '') {
                this.props.removeFilter();
            } else {
                this.props.filter(parseFilterInput(input));
            }
        } catch (e) {
            alert(e.message);
        }
    }

    render() {
        return (
            <div className={'FilterBar'}>
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={8}>Filter</Col>
                    <Col sm={8}>
                        <FormControl
                            placeholder="enter filter"
                            onChange={this.onChangeFilterInput}
                        />
                    </Col>
                    <Button
                        className={'FilterButton'}
                        bsSize="small"
                        active={true}
                        onClick={this.filter}
                    >Filter
                    </Button>
                </FormGroup>
            </div>
        );
    }
}