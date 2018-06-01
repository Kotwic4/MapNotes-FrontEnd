import * as React from 'react';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { BootstrapTable, DeleteButton, TableHeaderColumn } from 'react-bootstrap-table';
import * as Button from 'react-bootstrap/lib/Button';
import * as Modal from 'react-bootstrap/lib/Modal';
import { ComplexAttrType } from '../../types/creation/ComplexAttrType';
import _ from 'lodash';
import * as ModalBody from 'react-bootstrap/lib/ModalBody';
import NewComplexAttribute from './NewComplexAttribute';

interface ComplexAttributeState {
    showAddNewComplexAttr: boolean;
    complexAttributes: Array<ComplexAttrType>;
    newComplexAttrName: string;
    newComplexAttrValue: string;
    operators: Array<string>;
    simpleAttrAvailableNames: Array<string>;
}

export default class ComplexAttribute extends React.Component<any, ComplexAttributeState> {

    private static getSimpleAttributesAvailableNames(simpleAttr: Array<any>) {
        console.log('gettng simple attr names');
        let a: Array<string> = [];
        for (let i  = 0; i < simpleAttr.length; i++) {
            if (simpleAttr[i].type === 'pln' || simpleAttr[i].type === 'm^2') {
                console.log('adding');
                a = a.concat(simpleAttr[i].name);
            }
        }
        return a;
    }

    constructor(props: any) {
        super(props);
        this.state = {
            complexAttributes: [],
            showAddNewComplexAttr: false,
            newComplexAttrName: '',
            newComplexAttrValue: '',
            operators: ['+', '-', '*', '/'],
            simpleAttrAvailableNames: ComplexAttribute.getSimpleAttributesAvailableNames(this.props.simpleAttr),
        };
        this.handleClickAddNewComplexAttr = this.handleClickAddNewComplexAttr.bind(this);
        this.handleDeleteRow = this.handleDeleteRow.bind(this);
        this.handleClickOnSaveAllComplexAttrButton = this.handleClickOnSaveAllComplexAttrButton.bind(this);
        this.createCustomDeleteButton = this.createCustomDeleteButton.bind(this);
        this.handleClickSaveOnComplexAttrButton = this.handleClickSaveOnComplexAttrButton.bind(this);
        this.handleCloseAddNewAttrBox = this.handleCloseAddNewAttrBox.bind(this);
    }

    handleClickAddNewComplexAttr() {
        if (this.state.simpleAttrAvailableNames.length === 0) {
            alert('there is no simple attributes from which you can make complex attributes!');
        } else {
            this.setState({
                showAddNewComplexAttr: true
            });
        }
    }

    handleDeleteRow(row: any) {
        alert('The row is deleted:\n');
        let newComplesAttributes = _.filter(this.state.complexAttributes, (attr) => attr.name !== row[0]);
        this.setState({
            complexAttributes: newComplesAttributes
        });
    }

    handleClickSaveOnComplexAttrButton(complexAttr: ComplexAttrType) {
        this.setState({
            complexAttributes: this.state.complexAttributes.concat(complexAttr)
        });    }

    handleClickOnSaveAllComplexAttrButton() {
        console.log('saving complex attr');
        this.props.handleSaveComplexAttr(this.state.complexAttributes);
    }

    handleCloseAddNewAttrBox() {
        this.setState({
            showAddNewComplexAttr: false,
        });
    }

    createCustomDeleteButton() {
        return (
            <div className={'deleteComplexAttrButton'}>
                <DeleteButton
                    btnText="Delete"
                    onClick={this.handleDeleteRow}
                />
            </div>
        );
    }

    render() {
        const options = {
            onDeleteRow: this.handleDeleteRow,
            deleteBtn: this.createCustomDeleteButton
        };

        let simpleAttrTable = (
            <BootstrapTable
                data={this.props.simpleAttr}
            >
                <TableHeaderColumn
                    dataField="name"
                    editable={false}
                    isKey={true}
                > simple attr name
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField="type"
                    editable={false}
                >type
                </TableHeaderColumn>
            </BootstrapTable>);

        let newComplexAttrModal;
        if (this.state.showAddNewComplexAttr) {
            newComplexAttrModal = (
                <NewComplexAttribute
                    handleClickSaveOnComplexAttrButton={this.handleClickSaveOnComplexAttrButton}
                    handleCloseAddNewAttrBox={this.handleCloseAddNewAttrBox}
                    simpleAttrAvailableNames={this.state.simpleAttrAvailableNames}
                    complexAttributes={this.state.complexAttributes}
                    simpleAttr={this.props.simpleAttr}
                />);

        } else {
            newComplexAttrModal = <div/>;
        }

        let complexAttTable;
        switch (this.state.complexAttributes) {
            case []:
                complexAttTable = <div/>;
                break;
            default:
                complexAttTable = (
                    <div>
                        <div className={'newButton'}>
                            <Button
                                className={'newComplexAttrButton'}
                                bsSize="small"
                                bsStyle="success"
                                active={true}
                                onClick={this.handleClickAddNewComplexAttr}
                            >New
                            </Button>
                        </div>
                        <BootstrapTable
                            deleteRow={true}
                            selectRow={{mode: 'radio'}}
                            data={this.state.complexAttributes}
                            options={options}
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
                    </div>);
                break;
        }

        return (
            <div>
                <Modal.Dialog>
                    <Modal.Header>
                        <Modal.Title> Hello in MapNotes </Modal.Title>
                    </Modal.Header>

                    <div className={'complexAttributes'}>
                        <ModalBody>
                            <div className={'attrTable'}> {simpleAttrTable} </div>
                            <div className={'attrTable'}> {complexAttTable} </div>
                            <div>{newComplexAttrModal} </div>
                        </ModalBody>
                        <Modal.Footer>
                            <Button
                                bsSize="small"
                                onClick={this.props.handleBackToSimpleAttr}
                            >Back to simple attributes
                            </Button>
                            <Button
                                bsSize="small"
                                onClick={this.handleClickOnSaveAllComplexAttrButton}
                                bsStyle="primary"
                            >Save complex attributes
                            </Button>
                        </Modal.Footer>
                    </div>
                </Modal.Dialog>
            </div>
        );
    }
}
