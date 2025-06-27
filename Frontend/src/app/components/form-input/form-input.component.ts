import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormInputModel } from '../../classes/form-input-model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ValueChangeEvent } from '../../interfaces/value-change-event';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css'
})
export class FormInputComponent implements OnInit {
  @Input() model: FormInputModel | null = null;
  @Input() productFormGroup: any;
  @Output() inputValueChangeEvent = new EventEmitter<ValueChangeEvent>();
  name: string | undefined = "";
  inputErrorMessage: string = "";

  inputIsInvalid(): boolean {
    const hasError: boolean = !this.productFormGroup.get(this.name).valid;
    const isTouched: boolean = this.productFormGroup.get(this.name).touched;
    const isDirty: boolean = this.productFormGroup.get(this.name).dirty;

    this.setInputErrorMessage();

    return hasError && (isDirty || isTouched);
  }

  setInputErrorMessage(): void {

    const errors = this.productFormGroup.get(this.name)?.errors;
    let error = !errors ? null : Object.keys(this.productFormGroup.get(this.name).errors)[0];

    if (!error) this.inputErrorMessage = "";
    if (error === "pattern") this.inputErrorMessage = "Input is not valid.";
    if (error === "required") this.inputErrorMessage = "This field is required.";
    if (error === "email") this.inputErrorMessage = "Email is not valid.";
  }

  ngOnInit(): void {
      this.name = this.model?.name;
  }

  getInputValidationClass(): string {
    const isValid: boolean = this.productFormGroup.get(this.name).valid;
    const isTouched: boolean = this.productFormGroup.get(this.name).touched;
    const isDirty: boolean = this.productFormGroup.get(this.name).dirty;    

    if (isValid) {
      return "is-valid";
    }

    if (!isValid && (isTouched || isDirty)) {
      return "is-invalid";
    }
  
    return "";
  }

  onInputValueChange(event: any): void {
      const target: HTMLInputElement = event.target;
      const elementId = target.getAttribute("id");
      const elementType = target.getAttribute("type");
      const value = target.value;
      const eventObject: ValueChangeEvent = {
        elementId: elementId || "", 
        newValue: value,
        inputType: elementType || ""
      };
      this.inputValueChangeEvent.emit(eventObject);
  }

  clearFileInput(event: any): void {
      const target: HTMLElement = event.target;
      const fileInputId = target.getAttribute("data-for-input");

      if (fileInputId) {
          const fileInput: HTMLInputElement = document.getElementById(fileInputId) as HTMLInputElement;
          fileInput.value = "";

          this.inputValueChangeEvent.emit({
            elementId: fileInputId || "", 
            newValue: fileInput.value,
            inputType: "file"
          });
      }
  }
}
