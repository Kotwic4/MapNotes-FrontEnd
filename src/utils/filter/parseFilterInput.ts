import { Filter } from '../../types/filter/Filter';
import { OrFilter } from '../../types/filter/OrFilter';
import { AndFilter } from '../../types/filter/AndFilter';
import { AttributeFilter } from '../../types/filter/AttributeFilter';
import { TextCheckMode, TextFilterType } from '../../types/filter/TextFilterType';
import { ValueCheckMode, ValueFilterType } from '../../types/filter/ValueFilterType';
import { SearchFilter } from '../../types/filter/SearchFilter';

function containLessGraterEqual(input: string): boolean {
    return input.includes('<') || input.includes('>') || input.includes('=');
}

function chooseTextMode(text: string): TextCheckMode {
    const firstPoint = text.indexOf('.');
    if (firstPoint === -1) {
        return TextCheckMode.Part;
    }
    if (firstPoint !== text.length - 1) {
        throw new Error('Znak \'.\' może być użyty tylko na końcu wartości lub atrybutu');
    } else {
        return TextCheckMode.Exactly;
    }
}

function parseParameter (parameter: string):  Filter {
    parameter = parameter.trim();
    if (containLessGraterEqual(parameter)) {
        throw new Error('Aby użyć operatorów porównania należy podać atrybut danego pola');
    }
    const textMode = chooseTextMode(parameter);
    parameter = parameter.replace('.', '').trim();
    return new SearchFilter(new TextFilterType(parameter, textMode));
}

function chooseValueMode(text: string): ValueCheckMode {
    const firstPoint = text.indexOf('.');
    if (firstPoint === -1) {
        let returnType: ValueCheckMode = ValueCheckMode.Part;
        if (text.indexOf('!=') === 0) {
            text = text.slice(2);
            returnType = ValueCheckMode.NotEq;
        } else if (text.indexOf('<=') === 0) {
            text = text.slice(2);
            returnType = ValueCheckMode.LessEq;
        } else if (text.indexOf('>=') === 0) {
            text = text.slice(2);
            returnType = ValueCheckMode.GraterEq;
        } else if (text.indexOf('>') === 0) {
            text = text.slice(1);
            returnType = ValueCheckMode.Grater;
        } else if (text.indexOf('<') === 0) {
            text = text.slice(1);
            returnType = ValueCheckMode.Less;
        }
        if (containLessGraterEqual(text)) {
            throw new Error('Operatory porównania dla pojednynczego warunku mogą występować najwyżej jeden raz');
        }
        return returnType;
    }
    if (firstPoint !== text.length - 1) {
        throw new Error('Znak \'.\' może być użyty tylko na końcu wartości lub atrybutu');
    } else {
        return ValueCheckMode.Exactly;
    }
}

function parseWithAttributeCondition (condition: string): Filter {
    const attributeValue = condition.split(':');
    if (attributeValue.length !== 2) {
        throw new Error('W danym warunku może być co najwyżej jeden znacznik atrybutu \':\'');
    }
    const keyFilter = attributeValue[0].replace('.', '').trim();
    const valueFilter = attributeValue[1]
                            .replace('.', '')
                            .replace('>', '')
                            .replace('<', '')
                            .replace('!=', '')
                            .trim();
    return new AttributeFilter(
        new TextFilterType(keyFilter, chooseTextMode(attributeValue[0].trim())),
        new ValueFilterType(valueFilter, chooseValueMode(attributeValue[1].trim()))
    );
}

function parseFilterAndInput (condition: string): Filter {
    if (condition.includes(':')) {
        return parseWithAttributeCondition(condition);
    } else {
        return parseParameter(condition);
    }
}

function parseFilterOrInput (input: string): Filter {
    const splitByAnd: Array<string> = input.split('&');
    return new AndFilter(splitByAnd.map(parseFilterAndInput));
}

export function parseFilterInput (input: string): Filter {
    const splitByOr: Array<string> = input.split('|');
    return new OrFilter(splitByOr.map(parseFilterOrInput));
}