export enum TextCheckMode {
    Exactly = 0,
    Part = 1
}

export class TextFilterType {
    private value: string;
    private mode: TextCheckMode;

    constructor(value: string, mode: TextCheckMode) {
        this.value = value;
        this.mode = mode;
    }

    checkValue(value: any): boolean {
        switch (this.mode) {
            case TextCheckMode.Exactly:
                return value === this.value;
            default:
                if (typeof value === 'string' || value instanceof String) {
                    return value.includes(this.value);
                }
                return false;
        }
    }
}
