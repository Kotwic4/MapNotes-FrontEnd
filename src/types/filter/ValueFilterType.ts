export enum ValueCheckMode {
    LessEq = 0,
    GraterEq = 1,
    Less = 2,
    Grater = 3,
    NotEq = 4,
    Exactly = 5,
    Part = 6
}

export class ValueFilterType {
    private value: string;
    private mode: ValueCheckMode;

    constructor(value: string, mode: ValueCheckMode) {
        this.value = value;
        this.mode = mode;
    }

    checkValue(value: any): boolean {
        switch (this.mode) {
            case ValueCheckMode.LessEq:
                return value <= this.value;
            case ValueCheckMode.GraterEq:
                return value >= this.value;
            case ValueCheckMode.Less:
                return value < this.value;
            case ValueCheckMode.Grater:
                return value > this.value;
            case ValueCheckMode.NotEq:
                return value !== this.value;
            case ValueCheckMode.Exactly:
                return value === this.value;
            case ValueCheckMode.Part:
                if (typeof value === 'string' || value instanceof String) {
                    return value.includes(this.value);
                }
                return false;
            default:
                return false;
        }
    }
}
