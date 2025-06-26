export class FormInputModel {
    constructor(
        public name: string,
        public type: string,
        public text: string,
        public validators?: {validate: string, value?: any}[],
        public config?: {
          order?: number,
          optionSelectValues?: string[],
          id?: string,
          value?: any,
          disabled?: boolean,
          readonly?: boolean,
          step?: string,
          placeholder?: string,
          accept?: string
        }
      ) {}
}
