import { Component, inject } from '@angular/core';
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
import { MarcasService } from '../../services/marcas.service';
import { lastValueFrom } from 'rxjs';
import { ResponseAddMarca } from '../../interfaces/response-add-marca';
import { ResponseAddProduct } from '../../interfaces/response-add-product';

enum AccionesMarca {
  ignorar = "0",
  seleccionar = "1",
  agregar = "2"
}

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent, FormsModule, SelectMarcaComponent],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  title: string = "Alta de Producto";
  private route: ActivatedRoute = inject(ActivatedRoute);
  formBuilder: FormBuilder = inject(FormBuilder);
	productsHttpService: ProductService = inject(ProductService);
  marcasHttpService: MarcasService = inject(MarcasService);
	productFormGroup: any; //Referencia al FormGroup

  product: Product | null = null;
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
      this.title = "Modificación de Producto"
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
        this.loadData();  
        localStorage.setItem("productData", JSON.stringify(this.product));      
      },
      error: err => {
        this.product = null;
      }
    })
  }

/**
 * to do: 
 * guardar datos recibidos del producto
 * comparar datos recibidos con datos modificados, notificar datos cambiados
 * hacer alta solo si no se esta haciendo modificacion
 * implementar llamado a servicio de modificacion de producto
 * implementar operacion en backend de modificacion de producto
 */ 

  loadData() {
    //cargar inputs con valores recibidos del Producto
    this.inputModels.forEach( item => {
      if (this.product) {
        const fieldName = item.name;
        const value = this.product[fieldName];
        this.productFormGroup.get(fieldName).setValue(value || '');
      }
    });
    //seleccionar la opcion correcta segun si tiene marca asignada o no
    const accionMarcaElement: HTMLSelectElement = document.querySelector("#accionMarca") as HTMLSelectElement;
    if (this.product?.marca_nombre) {
      this.marcaSeleccionada = this.product.marca_nombre;

      for (let i=0; i<accionMarcaElement.options.length; i++) {
        accionMarcaElement.options[i].selected = false;
        if (accionMarcaElement.options[i].value === AccionesMarca.seleccionar) {
          accionMarcaElement.options[i].selected = true;
          this.accionMarca = AccionesMarca.seleccionar;
        }
      }
    }
    this.productFormGroup.get("id").disable();
  }

  async postForm(formData: any): Promise<void> {
    let nombreMarca = "";

    //si no se ha agregado el nombre de la marca al form, entonces envio el campo marca_nombre pero con su valor en null
    if (!formData['marca_nombre']) {
      formData['marca_nombre'] = null;
    } else {
      nombreMarca = formData['marca_nombre'];
    }
    
    if (this.accionMarca === AccionesMarca.agregar) {
      const existeMarca = await lastValueFrom(this.marcasHttpService.existeMarca(nombreMarca));

      if (existeMarca) {
        this.alertFailedCreation("La marca ingresada ya existe.");
        return;
      } else {
        const creacionMarca: ResponseAddMarca = await lastValueFrom(this.marcasHttpService.addMarca(nombreMarca)) as ResponseAddMarca;
        if (creacionMarca?.success === true) {
          this.alertSuccessfulToast(nombreMarca);
        } else {
          this.alertFailedCreation(creacionMarca.error || creacionMarca.mensaje);
          return;
        }
      }
    }
    this.postProduct(formData);
  }

  postProduct(formData: any) {
    this.productsHttpService.addProduct(formData).subscribe({
      next: (data) => {     
        if (data) {
          this.alertSuccessfulCreation();
        } else {
          this.alertFailedCreation(data);
        }
        this.productFormGroup.reset();
      },
      error: (err) => {
        console.error(err.error.error);
        this.alertServerError(err.error.mensaje);
      },
    });  
  }

	onFormSubmit(): void {
    if (this.productFormGroup.valid) {
    	const formData = this.productFormGroup.value;
      this.alertSubmitConfirmation(formData);
    } else {
    	this.alertInvalidForm();
    }
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
    formControl.markAsPristine();
    formControl.markAsUntouched();
    formControl.clearValidators();

    switch(accion) {
      case AccionesMarca.ignorar: {     
        formControl.setValue("");
        formControl.disable();
        break;
      }
      case AccionesMarca.seleccionar: {        
        formControl.setValue(this.marcaSeleccionada);        
        formControl.enable();        
        break;
      }
      case AccionesMarca.agregar: {
        formControl.setValue("");
        this.addValidatorsToFormControl(formControl, this.nuevaMarcaInputModel.validators);
        formControl.enable();
        break;
      }
    }
    formControl.updateValueAndValidity();
  }

  alertSuccessfulCreation() {
    Swal.fire({
      title: 'Producto creado exitosamente',
      text: 'Se creó un nuevo producto.',
      icon: 'success',
      showCloseButton: true,
      confirmButtonText: 'Aceptar',
    });
  }

  alertSuccessfulToast(data: string) {
    Swal.fire({
			toast: true,
			position: 'top-end',
			icon: 'success',
			title: `Marca '${data}' creada correctamente`,
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 2000,
		});
  }

  alertFailedCreation(data: string) {
    Swal.fire({
      title: 'Ocurrió un error al crear el producto',
      text: data,
      icon: 'error',
      showCloseButton: true,
      confirmButtonText: 'Accept',
    });
  }

  alertServerError(err: any) {
    Swal.fire({
      title: 'Ocurrió un error en el servidor.',
      text: err,
      icon: 'error',
      showCloseButton: true,
      confirmButtonText: 'Accept',
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

  alertSubmitConfirmation(formData: any) {
    Swal.fire({
      title: 'Confirmar alta de producto',
      icon: 'question',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postForm(formData)
      }
    })
  }
}
