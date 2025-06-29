//ANGULAR
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
//LIBS
import Swal from 'sweetalert2';
import { lastValueFrom } from 'rxjs';
//UTIL
import { FormInputModel } from '../../classes/form-input-model';
import { formInputTemplates } from '../../data/product-form-inputs-templates';
//COMPONENTS
import { FormInputComponent } from '../form-input/form-input.component';
import { SelectMarcaComponent } from '../select-marca/select-marca.component';
//SERVICES
import { MarcasService } from '../../services/marcas.service';
import { ProductService } from '../../services/product.service';
//INTERFACES
import { Product } from '../../interfaces/product';
import { ValueChangeEvent } from '../../interfaces/value-change-event';

//ENUM
enum AccionesMarca {
	ignorar 	= '0', //agregar despues
	seleccionar = '1', //seleccionar marca preexistente
	agregar     = '2', //crear una nueva marca
}

@Component({
	selector: 'app-product-form',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormInputComponent,
		FormsModule,
		SelectMarcaComponent,
	],
	templateUrl: './product-form.component.html',
	styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
	private router: Router = inject(Router);
	private route: ActivatedRoute = inject(ActivatedRoute);
	private formBuilder: FormBuilder = inject(FormBuilder);
	private productsHttpService: ProductService = inject(ProductService);
	private marcasHttpService: MarcasService = inject(MarcasService);

	public title: string = 'Alta de Producto';
	public productFormGroup: any; //Referencia al FormGroup
	private product: Product | null = null; //datos del producto si es una modificacion de producto
	private imageFile: File | null = null;
	private postedProductId!: string;
	public accionMarca: AccionesMarca = AccionesMarca.ignorar; //Valor de la accion a realizar sobre la marca
	/**
	 * Hacky stuff:
	 * Utilizo el mismo form input para enviar el nombre de la marca,
	 * tanto si es creada en el momento o si es seleccionada de las marcas preexistentes.
	 * El dropdown de seleccion de marca es para facilidad de uso del usuario, pero no es parte del FormGroup que se envia
	 * Asi que uso este valor para setear el valor del Form Input que si es enviado al Backend.
	 *
	 * Al mismo tiempo me sirve para pasarle el valor de la marca de un producto al componente select-marca
	 * cuando se cargan los datos de un producto que va a ser modificado
	 * (ver que el componente tiene @Input marcaSeleccionada).
	 * Asi el componente puede marcar como seleccionada la marca que corresponda para ese producto al inicializarse
	 */
	public marcaSeleccionada: string = '';

	/**
	 * Creo los inputs dinamicamente a partir de unos templates, me evita tener un html gigante para el form.
	 * Ademas lo hace mas sencillo para modificar o agregar cosas al form. Podria simplificarse aun mas de todos modos
	 */
	public inputModels: FormInputModel[] = formInputTemplates.basic
		.map( (e) => new FormInputModel(
					e.formControlName,
					e.type,
					e.labelText,
					e.validators,
					e.config)
		);

	//Input para la creacion de una nueva marca
	//Lo creo aparte del resto por tener mas logica asociada y tener una visibilidad condicional
	public nuevaMarcaInputModel: FormInputModel = (() => {
		const template = formInputTemplates.conditionals[0];
		return new FormInputModel(
			template.formControlName,
			template.type,
			template.labelText,
			template.validators,
			template.config
		);
	})(); //wrap en una funcion auto-invocada (IIFE) para que se ejecute inmediatamente despues de la declaracion

	ngOnInit(): void {
		//obtengo el id del producto de la ruta en caso de que se ingrese al url de modificar producto: 
		// /product-form/update/:id
		const productId = this.route.snapshot.paramMap.get('id');

		//si se obtuvo un id en el url busco el producto con ese id para rellenar el form con los datos del mismo
		if (productId) {
			this.fetchProductData(productId);
			this.title = 'Modificación de Producto';
		}

		//creo la instancia del formulario
		this.createFormInstance();
	}

	//setea la cedula del administrador que esta logueado en el campo admin_ci del formulario
	setCurrentAdminCI(): void {
		const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
		if (user && user.ci) {
			const formControlAdmin: FormControl = this.productFormGroup.get('admin_ci');			
			formControlAdmin.setValue(user.ci);
		} else {
			this.router.navigate(['/login']);
		}
	}

	addValidatorsToFormControl(formControl: FormControl, validators: any): void {
		validators?.forEach((v: any) => {
			//cada form control puede tener varios validators, agrego aquellos definidos en los templates de inputs
			switch (v.validate) {
				case 'required':
					formControl.addValidators(Validators.required);
					break;
				case 'email':
					formControl.addValidators(Validators.email);
					break;
				case 'min':
					formControl.addValidators(Validators.min(v.value));
					break;
				case 'max':
					formControl.addValidators(Validators.max(v.value));
					break;
				case 'minLength':
					formControl.addValidators(Validators.minLength(v.value));
					break;
				case 'maxLength':
					formControl.addValidators(Validators.maxLength(v.value));
					break;
				case 'pattern':
					formControl.addValidators(Validators.pattern(v.value));
					break;
				default:
					break;
			}
		});
	}

	//Creo el FormGroup con todos los FormControl (cada input/select/textarea...) basado en los templates
	createFormGroup(): any {
		const group: any = {};
		let formControlElement: FormControl;

		this.inputModels.forEach((e) => {
			formControlElement = new FormControl();
			this.addValidatorsToFormControl(formControlElement, e.validators);
			group[e.name] = formControlElement;
		});

		const marcaFormControl = new FormControl({ value: '', disabled: true });
		group[this.nuevaMarcaInputModel.name] = marcaFormControl;

		return group;
	}

	createFormInstance(): void {
		const group = this.createFormGroup();
		this.productFormGroup = this.formBuilder.group(group);
		this.setCurrentAdminCI();
	}

	fetchProductData(id: string): void {
		this.productsHttpService.getProductoById(id).subscribe({
			next: (response) => {
				if (response) {
					this.product = response;
					if (this.product.marca_nombre == null) { this.product.marca_nombre = "";}
					this.loadData();
				} else {
					this.product = null;
					this.router.navigate(['/404']);
				}
			},
			error: (err) => {
				console.error(err);
				this.product = null;
				this.router.navigate(['/404']);
			},
		});
	}

	/**
	 * funcion que revisa cuales campos fueron modificados en la modificacion de productos 
	 * para poder mostrar el valor previo y el nuevo al usuario antes de enviar la peticion
	 */
	obtainModifiedFields(): any {
		const modified: any = {};
		if (this.product) {
			Object.keys(this.product).forEach((key) => {
				const productInfoValue = this.product![key];
				const inputValue = this.productFormGroup.get(key).value;

				if (productInfoValue !== inputValue) {
					modified[key] = { old: productInfoValue, new: inputValue || "" };
				}
			});
		}

		return modified;
	}

	loadData(): void {
		//cargar inputs con valores recibidos del Producto
		this.inputModels.forEach((item) => {
			if (this.product) {
				const fieldName = item.name;
				const value = this.product[fieldName];				
				this.productFormGroup.get(fieldName).setValue(value || '');
			}
		});
		//seleccionar la opcion correcta segun si tiene marca asignada o no
		const accionMarcaElement: HTMLSelectElement = document.querySelector(
			'#accionMarca'
		) as HTMLSelectElement;
		if (this.product?.marca_nombre) {
			//si el producto ya tiene una marca extraigo la misma
			this.marcaSeleccionada = this.product.marca_nombre;

			//recorro las opciones del select para seleccionar la opcion de 'seleccionar marca existente'
			for (let i = 0; i < accionMarcaElement.options.length; i++) {
				accionMarcaElement.options[i].selected = false;
				if (accionMarcaElement.options[i].value === AccionesMarca.seleccionar) {
					accionMarcaElement.options[i].selected = true;
					this.accionMarca = AccionesMarca.seleccionar;
				}
			}
		}
		const productIdElement: HTMLInputElement = document.getElementById("productIdControl") as HTMLInputElement;		
		productIdElement.setAttribute("readonly", "true");

		this.setCurrentAdminCI();
	}

	async postForm(formData: any, createNew: boolean): Promise<void> {

		//si se selecciono la opcion de crear una nueva marca hago el request para crear la marca
		if (this.accionMarca === AccionesMarca.agregar) {
			const nombreMarca = formData['marca_nombre'];
			const existeMarca = await lastValueFrom(this.marcasHttpService.existeMarca(nombreMarca));

			if (existeMarca) {
				this.alertFailedCreation('La marca ingresada ya existe.');
				return;
			} else {
				const creacionMarca: any = await lastValueFrom(this.marcasHttpService.addMarca(nombreMarca));
				
				if (creacionMarca?.success === true) {
					this.alertSuccessfulToast(`Marca '${nombreMarca}' creada correctamente`);
				} else {
					this.alertFailedCreation(creacionMarca.error || creacionMarca.mensaje);
					return;
				}
			}
		}

		if (createNew) {
			this.postProduct(formData);
		} else {
			this.updateProduct(formData);
		}
	}

	captureInputValueChangeEvent(event: ValueChangeEvent): void {
		if (event.elementId === "imagenArchivo" && event.inputType === "file") {
			if (event.newValue === "") {
				this.imageFile = null;
			} else {
				const fileInput: HTMLInputElement = document.querySelector("#imagenArchivo") as HTMLInputElement;
				const files: FileList = fileInput.files as FileList;				
				const image = files[0];				
				this.imageFile = image;				
			}

			const imagenInputControl: FormControl = this.productFormGroup.get("imagen");
			if (event.newValue !== "") {
				imagenInputControl.removeValidators(Validators.required);
				imagenInputControl.setValue(null);
				imagenInputControl.disable();
				imagenInputControl.markAsPristine();
				imagenInputControl.markAsUntouched();
			} else {
				imagenInputControl.enable();
				imagenInputControl.addValidators(Validators.required)
			}
			imagenInputControl.updateValueAndValidity();
		}
	}

	postProduct(formData: any): void {		
		this.productsHttpService.addProduct(formData).subscribe({
			next: (data) => {
				if (data) {
					this.postedProductId = formData.id;
					this.alertSuccessfulCreation();
				} else {
					this.alertFailedCreation(data);
				}
				this.productFormGroup.disable();
			},
			error: (err) => {
				console.error(err.error.error);
				this.alertServerError(err.error);
			},
		});
	}

	updateProduct(formData: any): void {
		this.productsHttpService.updateProduct(formData).subscribe({
			next: (data) => {	
				if (data) {
					this.postedProductId = formData.id;
					this.alertSuccessfulUpdate(data);
				} else {
					this.alertFailedUpdate();
				}
			},
			error: (err) => {				
				console.error(err.error.error);
				this.alertServerError(err.error);
			},
		});
	}

	onFormSubmit(): void {
		
		if (this.productFormGroup.valid) {			
			const formData = this.productFormGroup.value;
			if (this.product) {
				this.alertUpdateConfirmation(formData);
			} else {
				this.alertSubmitConfirmation(formData);
			}
		} else {
			this.alertInvalidForm();
		}
	}

	setVisibilityClass(): string {
		if (this.accionMarca === AccionesMarca.seleccionar) {
			return 'visually-hidden';
		} else {
			return '';
		}
	}

	captureSeleccionMarca(event: any): void {
		this.marcaSeleccionada = event;
		const formControl = this.productFormGroup.get(
			this.nuevaMarcaInputModel.name
		);
		formControl.setValue(this.marcaSeleccionada);
	}

	/**
	 * Capturo la opcion del select sobre que accion realizar sobre la marca 
	 * (agregar despues, crear nueva o seleccionar)
	 * 
	 * Parte de la logica necesaria usar el mismo form input para la nueva marca y la marca seleccionada
	 */
	onChangeAccionMarca(event: any): void {
		const accion = event.target.value;
		this.accionMarca = accion;
		const formControl = this.productFormGroup.get(
			this.nuevaMarcaInputModel.name
		);
		formControl.markAsPristine();
		formControl.markAsUntouched();
		formControl.clearValidators();

		switch (accion) {
			case AccionesMarca.ignorar: {
				formControl.setValue('');
				formControl.disable();
				break;
			}
			case AccionesMarca.seleccionar: {
				formControl.setValue(this.marcaSeleccionada);
				formControl.enable();
				break;
			}
			case AccionesMarca.agregar: {
				formControl.setValue('');
				this.addValidatorsToFormControl(
					formControl,
					this.nuevaMarcaInputModel.validators
				);
				formControl.enable();
				break;
			}
		}
		formControl.updateValueAndValidity();
	}

	imageFileUpload(): void {

		if (this.imageFile && this.postedProductId) {
			//enviar solicitud para postear imagen
			this.productsHttpService.uploadImage(this.postedProductId, this.imageFile).subscribe({
				next: (response) => {
					this.alertSuccessfulToast(response.mensaje);					
				},
				error: (err) => {
					this.alertFailedToast(err.error.mensaje);
				}
			})
		}
	}

	/**
	 * ALERTS con sweetalert
	 */

	alertSuccessfulCreation(): void {
		this.imageFileUpload()

		Swal.fire({
			title: 'Producto creado exitosamente',
			text: 'Se creó un nuevo producto.',
			icon: 'success',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
				popup: 'animate__animated animate__fadeInDown animate__faster'
				},
				hideClass: {
				popup: 'animate__animated animate__fadeOut animate__faster'
				}
		}).then( () => {
			location.reload();
		} );
	}

	alertSuccessfulUpdate(data: any): void {
		this.imageFileUpload()

		Swal.fire({
			title: 'El producto fue actualizado exitosamente',
			text: `Producto: ${data?.id}`,
			icon: 'success',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		}).then( () => {
			this.router.navigate(['/']);
		})
	}

	alertSuccessfulToast(message: string): void {
		Swal.fire({
			toast: true,
			position: 'top-end',
			icon: 'success',
			title: message,
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 2000,
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}

	alertFailedToast(message: string): void {
		Swal.fire({
			toast: true,
			position: 'top-end',
			icon: 'error',
			title: message,
			showConfirmButton: false,
			timerProgressBar: true,
			timer: 2000,
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}

	alertFailedCreation(data: string): void {
		Swal.fire({
			title: 'Ocurrió un error al crear el producto',
			text: data,
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}

	alertFailedUpdate(): void {
		Swal.fire({
			title: 'Ocurrió un error al actualizar el producto',
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}

	alertServerError(err: any): void {
		Swal.fire({
			title: 'Ocurrió un error en el servidor.',
			text: err?.mensaje,
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}

	alertInvalidForm(): void {
		Swal.fire({
			title: 'El formulario está incompleto o tiene información inválida',
			text: 'Por favor complete el formulario.',
			icon: 'error',
			showCloseButton: true,
			confirmButtonText: 'Aceptar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		});
	}

	alertSubmitConfirmation(formData: any): void {
		Swal.fire({
			title: 'Confirmar alta de producto',
			icon: 'question',
			confirmButtonText: 'Aceptar',
			showCancelButton: true,
			cancelButtonText: 'Cancelar',
			showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOut animate__faster'
              }
		}).then((result) => {
			if (result.isConfirmed) {
				this.postForm(formData, true);
			}
		});
	}

	alertUpdateConfirmation(formData: any): void {

		const modifiedData = this.obtainModifiedFields();
		const keys = Object.keys(modifiedData);		

		if (keys.length === 0) {
			Swal.fire({
				title: 'No hay campos modificados',
				icon: 'info',
				confirmButtonText: 'Aceptar',
				showClass: {
					popup: 'animate__animated animate__fadeInDown animate__faster'
				},
				hideClass: {
					popup: 'animate__animated animate__fadeOut animate__faster'
				}
			});
		} else {
			Swal.fire({
				title: 'Confirmar modificación de producto',
				icon: 'question',
				html: `
					<h3>Datos modificados:</h3>
					${keys.map(key => {
						return "<p style='font-size:1.2em;'><b>" + key.toUpperCase() + "</b></p>" 
							+ "<p><b>Valor anterior:</b> " + modifiedData[key].old + "</p>"
							+ "<p><b>Valor nuevo:</b> " + modifiedData[key].new + "</p>"
					}).join('')}`,
				confirmButtonText: 'Aceptar',
				showCancelButton: true,
				cancelButtonText: 'Cancelar',
				showClass: {
					popup: 'animate__animated animate__fadeInDown animate__faster'
				},
				hideClass: {
					popup: 'animate__animated animate__fadeOut animate__faster'
				}
			}).then( (result) => {
				if (result.isConfirmed) {
					this.postForm(formData, false);				
				}
			});
		}
	}
}
