export const formInputTemplates = {
    constants: [
	{
		type: 'text',
		labelText: 'Identificador',
		formControlName: 'id',
		order: 1,
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 50 }, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: { }
	},
	{
		type: 'text',
		labelText: 'Nombre',
		formControlName: 'nombre',
		order: 2,
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 100 },
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: { placeholder: "NVIDIA RTX 4090 TI"}
	},
	{
		type: 'number',
		labelText: 'Precio',
		formControlName: 'precio',
		order: 4,
		validators: [
            { validate: 'required' }, 
            { validate: 'max', value: 99999999.99},
            { validate: 'pattern', value: new RegExp(/^\d{1,16}\.?\d{0,2}$/)}
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: { step: '0.01' }
	},
    {
		type: 'number',
		labelText: 'Stock',
		formControlName: 'stock',
		order: 5,
		validators: [
            { validate: 'required' }, 
            { validate: 'max', value: 9999},
            { validate: 'pattern', value: new RegExp(/^\d+$/)}
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: { step: '1' }
	},
    {
        type: 'text',
		labelText: 'Url Imagen',
		formControlName: 'imagen',
		order: 6,
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 255}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: {}
    },
    {
        type: 'text',
		labelText: 'CI Administrador',
		formControlName: 'admin_ci',
		order: 7,
		validators: [
            { validate: 'required' }, 
            { validate: 'minLength', value: 6},
            { validate: 'maxLength', value: 50}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: { placeholder: "12341234"}
    },
    {
        type: 'textarea',
		labelText: 'Descripción',
		formControlName: 'descripcion',
		order: 8,
		validators: [
            { validate: 'required' }, 
            { validate: "maxLength", value: 255}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: {}
    },
    {
        type: 'select',
		labelText: 'Categoría',
		formControlName: 'categoria',
		order: 3,
		validators: [ { validate: 'required' } ],
        optionSelectValues: [
            'CPU', 'MOTHERBOARD', 'TARJETA_GRAFICA', 
            'ALMACENAMIENTO', 'MEMORIAS', 'COOLING', 
            'GABINETES', 'MONITORES', 'TECLADOS', 'MOUSE'
        ],
        id: '',
        value: '',
        config: {}
    }
],
conditionals: [
    {
        type: 'text',
		labelText: 'Marca',
		formControlName: 'marca_nombre',
		order: 10,
		validators: [
            { validate: 'required' }, 
            { validate: 'maxLength', value: 100}, 
            { validate: 'pattern', value: new RegExp(/[\S]/g) }
        ],
        optionSelectValues: [],
        id: '',
        value: '',
        config: { disabled: true }
    }
]

};