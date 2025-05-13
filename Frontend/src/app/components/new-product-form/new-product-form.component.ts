import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormInputModel } from '../../classes/form-input-model';
import { formInputTemplates } from '../../data/product-form-inputs-templates';
import Swal from 'sweetalert2';
import { FormInputComponent } from '../form-input/form-input.component';
import { SelectMarcaComponent } from "../select-marca/select-marca.component";
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';

enum AccionesMarca {
  ignorar = "0",
  seleccionar = "1",
  agregar = "2"
}

@Component({
  selector: 'app-new-product-form',
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent, FormsModule, SelectMarcaComponent],
  templateUrl: './new-product-form.component.html',
  styleUrl: './new-product-form.component.css'
})
export class NewProductFormComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  formBuilder: FormBuilder = inject(FormBuilder);
	productsHttpService: ProductService = inject(ProductService);
	productFormGroup: any; //Referencia al FormGroup

  @Input() product: Product | null = null;
  fetchErrorMsg: string = ""; 
  accionMarca: AccionesMarca = AccionesMarca.ignorar; //Valor de la accion a realizar sobre la marca
  marcaSeleccionada: string = "";

  nuevaMarcaInputModel: FormInputModel = (() => {
    const template = formInputTemplates.conditionals[0];
    return new FormInputModel(
      template.formControlName, template.type, 
      template.labelText, template.order,
      template.validators
    )
  })();

  inputModels: FormInputModel[] = formInputTemplates.constants.map(
		(e) =>
			new FormInputModel(
				e.formControlName, e.type, e.labelText, e.order, 
        e.validators,e.optionSelectValues, e.id, e.value, e.config
			)
	).sort( (a,b) => a.order - b.order);

	ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductData(productId);
    }
    
    this.createFormInstance();
	}

  addValidatorsToFormControl(formControl: FormControl, validators: any) {
    validators?.forEach((v: any) => {
      if (v.validate === "required") formControl.addValidators(Validators.required);
      if (v.validate === "email") formControl.addValidators(Validators.email);
      if (v.validate === "min") formControl.addValidators(Validators.min(v.value));
      if (v.validate === "minLength") formControl.addValidators(Validators.minLength(v.value));
      if (v.validate === "max") formControl.addValidators(Validators.max(v.value));
      if (v.validate === "maxLength") formControl.addValidators(Validators.maxLength(v.value));
      if (v.validate === "pattern") formControl.addValidators(Validators.pattern(v.value));
    });
  }

	createFormGroup(): any {
		const group: any = {};
		let formControlElement: FormControl;

		this.inputModels.forEach((e) => {
			formControlElement = new FormControl();
      this.addValidatorsToFormControl(formControlElement, e.validators);
			group[e.name] = formControlElement;
		});

    const marcaFormControl = new FormControl({value: '', disabled: true});
    group[this.nuevaMarcaInputModel.name] = marcaFormControl;

		return group;	
	}

	createFormInstance(): void {
		const group = this.createFormGroup();
		this.productFormGroup = this.formBuilder.group(group);
	}

  fetchProductData(id: string) {
    this.productsHttpService.getProductoById(id).subscribe({
      next: response => {
        this.product = response;
        console.log(response);
        
      },
      error: err => {
        this.product = null;
        this.fetchErrorMsg = `Error al obtener los datos del producto de id '${id}'. ${err}`
        console.error(err);
      }
    })
  }

	postFormData(formData: any): void {
    if (!formData['marca_nombre']) {
      formData['marca_nombre'] = null;
    }
    
		this.productsHttpService
			.addProduct(formData)
			.subscribe({
				next: (data) => {     
          if (data) {
            Swal.fire({
              title: 'Producto creado exitosamente',
              text: 'Se creó un nuevo producto.',
              icon: 'success',
              showCloseButton: true,
              confirmButtonText: 'Aceptar',
            });
          } else {
            Swal.fire({
              title: 'Ocurrió un error al crear el producto',
              text: `Resultado: ${data}.`,
              icon: 'error',
              showCloseButton: true,
              confirmButtonText: 'Accept',
            });
          }
					this.productFormGroup.reset();
				},
				error: (err) => {
					Swal.fire({
						title: 'Ocurrió un error en el servidor.',
						text: err,
						icon: 'error',
						showCloseButton: true,
						confirmButtonText: 'Accept',
					});
				},
			});      
	}

	alertInvalidForm(): void {
		Swal.fire({
			title: 'El formulario está incompleto o tiene información inválida',
			text: 'Por favor complete el formulario.',
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
		});
	}

  confirmationAlert(formData: any) {
    Swal.fire({
      title: 'Confirmar alta de producto',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postFormData(formData);
      }
    })
  }

	onFormSubmit(): void {
    if (this.productFormGroup.valid) {
    	const formData = this.productFormGroup.value;
      this.confirmationAlert(formData);
    } else {
    	this.alertInvalidForm();
    }
    console.log(this.productFormGroup.value);
	}

  setVisibilityClass(): string {
    if (this.accionMarca === AccionesMarca.seleccionar) {
      return "visually-hidden";
    } else {
      return "";
    }
  }

  captureSeleccionMarca(event: any) {    
    this.marcaSeleccionada = event;
    const formControl = this.productFormGroup.get(this.nuevaMarcaInputModel.name);
    formControl.setValue(this.marcaSeleccionada);        
  }

  onChangeAccionMarca(event: any) {
    const accion = event.target.value;
    this.accionMarca = accion;
    const formControl = this.productFormGroup.get(this.nuevaMarcaInputModel.name);
    
    switch(accion) {
      case AccionesMarca.ignorar: {     
        formControl.markAsPristine();
        formControl.markAsUntouched();
        formControl.clearValidators();
        formControl.updateValueAndValidity();
        formControl.setValue("");
        formControl.disable();
        break;
      }
      case AccionesMarca.seleccionar: {        
        formControl.setValue(this.marcaSeleccionada);        
        formControl.clearValidators();
        formControl.updateValueAndValidity();
        formControl.enable();        
        break;
      }
      case AccionesMarca.agregar: {
        formControl.clearValidators();
        formControl.setValue("");
        this.addValidatorsToFormControl(formControl, this.nuevaMarcaInputModel.validators);
        formControl.updateValueAndValidity();
        formControl.enable();
        break;
      }
    }
  }
}
