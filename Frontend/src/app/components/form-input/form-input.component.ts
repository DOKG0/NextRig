import { Component, Input, OnInit } from '@angular/core';
import { FormInputModel } from '../../classes/form-input-model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css'
})
export class FormInputComponent implements OnInit {
  @Input() model: FormInputModel | null = null;
  @Input() productFormGroup: any;
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
}
