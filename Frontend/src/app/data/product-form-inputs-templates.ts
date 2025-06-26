export const formInputTemplates = {
    constants: [
	{
		type: 'text',
		labelText: 'Identificador',
		formControlName: 'id',
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 50 }, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        config: {
            order: 1,
            id: 'productIdControl'
        }
	},
	{
		type: 'text',
		labelText: 'Nombre',
		formControlName: 'nombre',
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 100 },
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        config: { 
            placeholder: "NVIDIA RTX 4090 TI",
            order: 2
        }
	},
	{
		type: 'number',
		labelText: 'Precio',
		formControlName: 'precio',
		validators: [
            { validate: 'required' }, 
            { validate: 'max', value: 99999999.99},
            { validate: 'pattern', value: new RegExp(/^\d{1,16}\.?\d{0,2}$/)}
        ],
        config: { 
            step: '0.01',
            order: 4,
        }
	},
    {
		type: 'number',
		labelText: 'Stock',
		formControlName: 'stock',
		validators: [
            { validate: 'required' }, 
            { validate: 'max', value: 9999},
            { validate: 'pattern', value: new RegExp(/^\d+$/)}
        ],
        config: { 
            step: '1', 
            order: 5,
        }
	},
    {
        type: 'text',
		labelText: 'Url Imagen',
		formControlName: 'imagen',
		validators: [
            { validate: 'maxLength', value: 255}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        config: {
            order: 7
        }
    },
    {
        type: 'file',
		labelText: 'Subir Imagen',
		formControlName: 'imagenArchivo',
		validators: [],
        config: {
            order: 8,
            accept: "image/png, image/jpeg, image/webp, image/jpg"
        }
    },
    {
        type: 'text',
		labelText: 'CI Administrador',
		formControlName: 'admin_ci',
		validators: [
            { validate: 'required' }, 
            { validate: 'minLength', value: 6},
            { validate: 'maxLength', value: 50}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        config: { 
            placeholder: "12341234",
    		order: 6,
            readonly: true
        }
    },
    {
        type: 'textarea',
		labelText: 'Descripción',
		formControlName: 'descripcion',
		validators: [
            { validate: 'required' }, 
            { validate: "maxLength", value: 255}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        config: {
            order: 20
        }
    },
    {
        type: 'select',
		labelText: 'Categoría',
		formControlName: 'categoria',
		validators: [ { validate: 'required' } ],
        config: {
    		order: 3,
            optionSelectValues: [
            'CPU', 'MOTHERBOARD', 'TARJETA_GRAFICA', 
            'ALMACENAMIENTO', 'MEMORIAS', 'COOLING', 
            'GABINETES', 'MONITORES', 'TECLADOS', 'MOUSE'
        ],
        }
    }
],
conditionals: [
    {
        type: 'text',
		labelText: 'Ingrese la marca',
		formControlName: 'marca_nombre',
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 100}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        config: { 
            disabled: true, 
    		order: 10
        }
    }
]
};