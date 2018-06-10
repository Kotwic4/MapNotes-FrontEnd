import * as React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as Button from 'react-bootstrap/lib/Button';
import * as Modal from 'react-bootstrap/lib/Modal';
import { ComplexAttrType } from '../../types/creation/ComplexAttrType';
import _ from 'lodash';
import * as ModalBody from 'react-bootstrap/lib/ModalBody';
import NewComplexAttribute from './NewComplexAttribute';
import { SimpleAttrType } from '../../types/creation/SimpleAttrType';
import { BasicAttrType } from '../../types/BasicAttrType';
import { OPERATORS, TYPES } from '../../constants/index';

interface CreateAttributeState {
    showAddNewComplexAttr: boolean;
    complexAttributes: ComplexAttrType[];
    simpleAttributes: SimpleAttrType[];
    simpleAttrAvailableNames: string[];
}

export default class CreateAttributeComponent extends React.Component<any, CreateAttributeState> {
    counter = 0;
    getSimpleAttr(simpleAttr: Array<BasicAttrType>) {
        let simpleAttrWithIndex: Array<SimpleAttrType> = [];
        if (simpleAttr.length > 0) {
            simpleAttrWithIndex = simpleAttr.map((attr) => {
                this.counter++;
                return {
                    'id': this.counter,
                    'name': attr.name,
                    'type': attr.type
                };
            });
        }
        [1, 2, 3, 4].map(i => {
            this.counter++;
            simpleAttrWithIndex.push({
                'id': this.counter,
                'name': '',
                'type': ''
            });
        });
        return simpleAttrWithIndex;
    }

    constructor(props: any) {
        super(props);
        this.state = {
            complexAttributes: [],
            simpleAttributes: this.getSimpleAttr([]),
            showAddNewComplexAttr: false,
            simpleAttrAvailableNames: [],
        };
        this.handleClickAddNewComplexAttr = this.handleClickAddNewComplexAttr.bind(this);
        this.handleCloseAddNewAttrBox = this.handleCloseAddNewAttrBox.bind(this);
        this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
        this.getSimpleAttributesAvailableNames = this.getSimpleAttributesAvailableNames.bind(this);
        this.handleClickAddNewSimpleAttr = this.handleClickAddNewSimpleAttr.bind(this);
        this.isNewAttrNameUsed = this.isNewAttrNameUsed.bind(this);
        this.handleClickSaveOnComplexAttrButton = this.handleClickSaveOnComplexAttrButton.bind(this);
        this.handleClickAddNewSimpleAttr = this.handleClickAddNewSimpleAttr.bind(this);
        this.handleDeleteSimpleAttrRow = this.handleDeleteSimpleAttrRow.bind(this);
        this.handleDeleteComplexAttrRow = this.handleDeleteComplexAttrRow.bind(this);
        this.handleClickSaveAttributes = this.handleClickSaveAttributes.bind(this);
        this.prepareBasicAttr  = this.prepareBasicAttr.bind(this);
        this.getAttrList = this.getAttrList.bind(this);
        this.renderSimpleAttrTable = this.renderSimpleAttrTable.bind(this);
        this.renderComplexAttrTable = this.renderComplexAttrTable.bind(this);
        this.renderNewComplexAttrModal = this.renderNewComplexAttrModal.bind(this);
    }

    getSimpleAttributesAvailableNames(simpleAttr: SimpleAttrType[]) {
        return simpleAttr
            .filter(attr => attr.type === 'pln' || attr.type === 'm^2' || attr.type === 'number')
            .filter(attr => attr.name !== '')
            .map(attr => attr.name);
    }

    isNewAttrNameUsed(newName: string) {
        const simpleNames: string[]  = this.state.simpleAttributes.map( i => i.name);
        const complexNames: string[]  = this.state.complexAttributes.map(i => i.name);

        return (_.includes(simpleNames, newName) ||
            _.includes(complexNames, newName));
    }

    onBeforeSaveCell(row: any, cellName: any, cellValue: any) {
        const newSimpleAttr: SimpleAttrType = this.state.simpleAttributes.filter((attr) => attr.id === row.id)[0];
        if ( cellName === 'name') {
            if (this.isNewAttrNameUsed(cellValue) && cellValue !== '') {
                alert ('Name of simple attribute must be unique! ');
                return false;
            }
            newSimpleAttr.name = cellValue;
        } else if ( cellName === 'type' && cellValue !== '') {
            // check if row is used in complex Attr
            const  listOfUsedAttr = this.state.complexAttributes
                .filter( (attr) => _.includes(this.getAttrList(attr.value), row.name));
            if (listOfUsedAttr.length !== 0) {
                alert('The value cannot be changed!\n ' +
                    'There is a dependency in complex attributes\n' +
                    'Try to delete first complex attribute. \n');
                return false;
            }
            newSimpleAttr.type = cellValue;
        }
        const index = _.findIndex(this.state.simpleAttributes, (attr) => attr.id === row.id);
        this.state.simpleAttributes[index] = newSimpleAttr;
        return true;
    }

    handleClickAddNewComplexAttr() {
        const availableNames = (this.getSimpleAttributesAvailableNames(this.state.simpleAttributes));
        if (availableNames.length === 0) {
            alert('There is no basic attributes from which you can make complex attributes!' +
                'Try to create basic attr with type pln, m^2 or number. ');
        } else {
            this.setState({
                showAddNewComplexAttr: true,
            });
        }
    }

    handleClickAddNewSimpleAttr() {
        this.counter += 1;
        let newSimpleAttr: SimpleAttrType = {
            'id': this.counter,
            'name': '',
            'type': ''
        };
        this.setState({
            simpleAttributes: [...this.state.simpleAttributes, newSimpleAttr]
        });
    }

    getAttrList(value: string) {
        value = value.split(' ').join('');
        const args = value.split(/\[|\]/ );
        return args.filter(i => !_.includes(OPERATORS, i) && i !== '');
    }

    handleDeleteSimpleAttrRow(rows: any) {
        const newSimpleAttributes: SimpleAttrType[] =
            this.state.simpleAttributes.filter((attr) => !_.includes(rows,  attr.id));
        let listOfUsedAttr: Array<any> = [];

        if (newSimpleAttributes.length !== this.state.simpleAttributes.length) {
            const toDeleteSimpleAttr: Array<string>  = this.state.simpleAttributes
                    .filter( (attr) => _.includes(rows, attr.id))
                    .map( (attr) => attr.name);

            for (let i = 0; i < this.state.complexAttributes.length; i++ ) {
                listOfUsedAttr = this.getAttrList(this.state.complexAttributes[i].value)
                    .filter( j => _.includes(toDeleteSimpleAttr, j));
                if (listOfUsedAttr.length !== 0) {
                    this.setState({
                        simpleAttributes: this.state.simpleAttributes
                    });
                    alert('The rows cannot be deleted! \n ' +
                        'There is a dependency in complex attributes \n' +
                        'Try to delete first complex attribute. \n');
                    return false;
                }
            }
        }
        if (listOfUsedAttr.length === 0 ) {
            this.setState({
                simpleAttributes: newSimpleAttributes
            });
            alert('The rows are deleted: \n' + rows);
            return true;
        }
        return true;
    }

    handleDeleteComplexAttrRow(rows: any) {
        const newComplexAttributes: ComplexAttrType[] =
            this.state.complexAttributes.filter((attr) => !_.includes(rows, attr.name));
        this.setState({
            complexAttributes: newComplexAttributes,
        });
        alert('The rows are deleted: \n' + rows);
        return true;
    }

    prepareBasicAttr() {
        return this.state.simpleAttributes
            .filter((attr) => attr.name !== '' && attr.type !== '')
            .map((attr) => {
            return {
                'name': attr.name,
                'type': attr.type
            };
        });
    }

    handleClickSaveAttributes() {
        this.props.handleSave(this.prepareBasicAttr(), this.state.complexAttributes);
    }

    handleCloseAddNewAttrBox() {
        this.setState({
            showAddNewComplexAttr: false,
        });
    }

    handleClickSaveOnComplexAttrButton(complexAttr: ComplexAttrType) {
        this.setState({
            complexAttributes: this.state.complexAttributes.concat(complexAttr)
        });
    }

    renderSimpleAttrTable() {
        return (
            <div>
                <Button
                    className={'NewComplexAttrButton'}
                    bsSize="small"
                    bsStyle="success"
                    active={true}
                    onClick={this.handleClickAddNewSimpleAttr}
                >New
                </Button>
                <BootstrapTable
                    deleteRow={true}
                    selectRow={{mode: 'checkbox'}}
                    cellEdit={{mode: 'click', blurToSave: true, beforeSaveCell: this.onBeforeSaveCell }}
                    data={this.state.simpleAttributes}
                    options={{
                        onDeleteRow: this.handleDeleteSimpleAttrRow,
                    }}
                ><TableHeaderColumn
                    dataField="id"
                    isKey={true}
                    hidden={true}
                > id
                </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField="name"
                    > simple attribute name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField="type"
                        dataSort={true}
                        editable={{ type: 'select', options: {values: [''].concat(TYPES)}}}
                    >simple attr type
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }

    renderComplexAttrTable() {
        return (
            <div className={'ComplexAttrTable'}>
                <div className={'NewButton'}>
                    <Button
                        className={'NewComplexAttrButton'}
                        bsSize="small"
                        bsStyle="success"
                        active={true}
                        onClick={this.handleClickAddNewComplexAttr}
                    >New
                    </Button>
                </div>
                <BootstrapTable
                    deleteRow={true}
                    selectRow={{mode: 'checkbox'}}
                    data={this.state.complexAttributes}
                    options={{
                        onDeleteRow: this.handleDeleteComplexAttrRow
                    }}
                >
                    <TableHeaderColumn
                        dataField="name"
                        editable={false}
                        isKey={true}
                    > complex attribute name
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataField="value"
                        editable={true}
                    >complex attribute value
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    }

    renderNewComplexAttrModal() {
        if (this.state.showAddNewComplexAttr) {
            return (
                <NewComplexAttribute
                    handleClickSaveOnComplexAttrButton={this.handleClickSaveOnComplexAttrButton}
                    handleCloseAddNewAttrBox={this.handleCloseAddNewAttrBox}
                    simpleAttrAvailableNames={this.getSimpleAttributesAvailableNames(this.state.simpleAttributes)}
                    complexAttributes={this.state.complexAttributes}
                    simpleAttr={this.state.simpleAttributes}
                />);

        }
        return null;
    }

    render() {
        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title> Hello in MapNotes </Modal.Title>
                    </Modal.Header>

                    <div className={'complexAttributes'}>
                        <ModalBody>
                            <div className={'attrTable'}>
                                <h4 className={'attrTitle'}>Basic Attributes</h4>
                                {this.renderSimpleAttrTable()}
                            </div>
                            <div className={'attrTable'}>
                                <h4 className={'attrTitle'}>Complex Attributes</h4>
                                {this.renderComplexAttrTable()}
                            </div>
                            <div>{this.renderNewComplexAttrModal()} </div>
                        </ModalBody>
                        <Modal.Footer>
                            <Button
                                bsSize="small"
                                onClick={this.props.handleClose}
                            >Close
                            </Button>
                            <Button
                                bsSize="small"
                                onClick={this.handleClickSaveAttributes}
                                bsStyle="primary"
                            >Save attributes
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal.Dialog>
            </div>
        );
    }
}
