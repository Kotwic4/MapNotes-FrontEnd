export enum TextCheckMode {
    Exactly = 0,
    Part = 1
}

export class TextFilterType {
    private value: String;
    private mode: TextCheckMode;

    constructor(value: String, mode: TextCheckMode) {
        this.value = value;
        this.mode = mode;
    }

    checkValue(value: any): boolean {
        switch (this.mode) {
            case TextCheckMode.Exactly:
                return value === this.value;
            default:
                return value.includes(this.value);
        }
    }
}
