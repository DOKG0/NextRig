export class FormInputModel {
    constructor(
        public name: string,
        public type: string,
        public text: string,
        public order: number,
        public validators?: {validate: string, value?: any}[],
        public optionSelectValues?: string[],
        public id?: string,
        public value?: any,
        public config?: any
      ) {}
}
