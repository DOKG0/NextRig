export const productsList: Product[] = [
    // 🧠 CPU
    {
      id: 1,
      name: 'Intel Core i7-13700K',
      description: 'Procesador de 16 núcleos y 24 hilos, ideal para gaming y productividad.',
      price: 450,
      imageUrl: 'https://www.intel.com/content/dam/www/central-libraries/us/en/images/2022-10/desktop-13th-gen-core-i7-13700k-1.jpg',
      category: 'CPU',
      stock: 15,
      adminCI: '12345678'
    },
    {
      id: 2,
      name: 'AMD Ryzen 9 7900X',
      description: 'Procesador de alto rendimiento con 12 núcleos y 24 hilos.',
      price: 420,
      imageUrl: 'https://www.amd.com/system/files/2022-09/1265222-amd-ryzen-9-7900x-processor-PIB-1265222-1265222-1265222.png',
      category: 'CPU',
      stock: 10,
      adminCI: '12345678'
    },
  
    // 🧩 Motherboards
    {
      id: 3,
      name: 'ASUS ROG Strix B650E-E Gaming WiFi',
      description: 'Placa madre AM5 con soporte DDR5 y PCIe 5.0.',
      price: 300,
      imageUrl: 'https://dlcdnwebimgs.asus.com/gain/7f1e2e9b-0c3d-4b3e-8c3f-4f3f1e1e1e1e/',
      category: 'Motherboard',
      stock: 12,
      adminCI: '12345678'
    },
    {
      id: 4,
      name: 'Gigabyte Z790 AORUS Elite',
      description: 'Placa madre para Intel con soporte para overclock y DDR5.',
      price: 280,
      imageUrl: 'https://www.gigabyte.com/FileUpload/Global/KeyFeature/1919/innergigabyteimages/mb-z790-aorus-elite-ax-1.jpg',
      category: 'Motherboard',
      stock: 8,
      adminCI: '12345678'
    },
  
    // 🎮 Tarjetas Gráficas
    {
      id: 5,
      name: 'NVIDIA GeForce RTX 4070 Ti',
      description: 'Tarjeta gráfica de última generación para gaming en 4K.',
      price: 800,
      imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/graphics-cards/40-series/rtx-4070-ti/rtx-4070-ti-product-photo-001.jpg',
      category: 'Tarjetas Gráficas',
      stock: 5,
      adminCI: '12345678'
    },
    {
      id: 6,
      name: 'AMD Radeon RX 7900 XTX',
      description: 'Tarjeta gráfica potente para juegos en alta resolución.',
      price: 900,
      imageUrl: 'https://www.amd.com/system/files/2022-12/1265222-amd-radeon-rx-7900-xtx-graphics-card-PIB-1265222-1265222-1265222.png',
      category: 'Tarjetas Gráficas',
      stock: 7,
      adminCI: '12345678'
    },
  
    // 💾 Almacenamiento
    {
      id: 7,
      name: 'Samsung 980 PRO 1TB',
      description: 'SSD NVMe PCIe 4.0 ultra rápido para almacenamiento principal.',
      price: 130,
      imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/levant/980-pro-1tb-ssd-mz-v8p1t0bw-1.jpg',
      category: 'Almacenamiento',
      stock: 20,
      adminCI: '12345678'
    },
    {
      id: 8,
      name: 'Western Digital Black SN850X 2TB',
      description: 'SSD de alto rendimiento para gaming y tareas exigentes.',
      price: 250,
      imageUrl: 'https://www.westerndigital.com/content/dam/store/en-us/assets/products/internal-storage/wd-black-sn850x-nvme-ssd/gallery/wd-black-sn850x-nvme-ssd-1tb-front.png',
      category: 'Almacenamiento',
      stock: 15,
      adminCI: '12345678'
    },
  
    // 🧠 Memorias RAM
    {
      id: 9,
      name: 'Corsair Vengeance RGB Pro 32GB',
      description: 'Kit de memoria DDR4 con iluminación RGB y gran rendimiento.',
      price: 150,
      imageUrl: 'https://www.corsair.com/medias/sys_master/images/images/h3e/h7b/9119317737502/-CMW32GX4M2C3200C16-Gallery-VENGEANCE-RGB-PRO-01.png',
      category: 'Memorias',
      stock: 25,
      adminCI: '12345678'
    },
    {
      id: 10,
      name: 'G.Skill Trident Z5 RGB 32GB',
      description: 'Memoria DDR5 de alto rendimiento con diseño elegante.',
      price: 200,
      imageUrl: 'https://www.gskill.com/_upload/images/20211019102935_1.png',
      category: 'Memorias',
      stock: 18,
      adminCI: '12345678'
    },
  
    // ❄️ Cooling
    {
      id: 11,
      name: 'Cooler Master Hyper 212 Black',
      description: 'Sistema de enfriamiento por aire eficiente y silencioso.',
      price: 50,
      imageUrl: 'https://www.coolermaster.com/media/assets/1009/hyper-212-black-1.jpg',
      category: 'Cooling',
      stock: 18,
      adminCI: '12345678'
    },
    {
      id: 12,
      name: 'NZXT Kraken Z63',
      description: 'Enfriamiento líquido AIO con pantalla LCD personalizable.',
      price: 250,
      imageUrl: 'https://nzxt.com/assets/cms/34299/1611326537-kraken-z63-1.jpg',
      category: 'Cooling',
      stock: 10,
      adminCI: '12345678'
    },
  
    // 🧱 Gabinetes
    {
      id: 13,
      name: 'NZXT H510 Flow',
      description: 'Gabinete con buen flujo de aire y diseño moderno.',
      price: 90,
      imageUrl: 'https://nzxt.com/assets/cms/34299/1611326537-h510-flow-1.jpg',
      category: 'Gabinetes',
      stock: 10,
      adminCI: '12345678'
    },
    {
      id: 14,
      name: 'Corsair 4000D Airflow',
      description: 'Gabinete ATX con excelente ventilación y espacio interior.',
      price: 100,
      imageUrl: 'https://www.corsair.com/medias/sys_master/images/images/h4b/hb4/9119317737502/-CC-9011200-WW-Gallery-4000D-AIRFLOW-BLACK-01.png',
      category: 'Gabinetes',
      stock: 12,
      adminCI: '12345678'
    },
  
    // 🖥️ Monitores
    {
      id: 15,
      name: 'MSI Optix MAG274QRF',
      description: 'Monitor gaming 1440p, 165Hz, con panel IPS.',
      price: 350,
      imageUrl: 'https://www.msi.com/image/600x400/monitor/optix-mag274qrf-qd.jpg',
      category: 'Monitores',
      stock: 6,
      adminCI: '12345678'
    },
    {
      id: 16,
      name: 'LG UltraGear 27GN950',
      description: 'Monitor 4K UHD con 144Hz y tecnología Nano IPS.',
      price: 700,
      imageUrl: 'https://www.lg.com/us/images/monitors/md07501377/gallery/desktop-01.jpg',
      category: 'Monitores',
      stock: 4,
      adminCI: '12345678'
    },
  
    // ⌨️ Teclados
    {
      id: 17,
      name: 'Logitech G Pro X Keyboard',
      description: 'Teclado mecánico compacto con switches intercambiables.',
      price: 130,
      imageUrl: 'https://resource.logitechg.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-keyboard/pro-x-keyboard-gallery-1.png?v=1',
      category: 'Teclados',
      stock: 14,
      adminCI: '12345678'
    },
    {
      id: 18,
      name: 'Razer Huntsman Elite',
      description: 'Teclado mecánico con switches ópticos y reposamuñecas ergonómico.',
      price: 200,
      imageUrl: 'https://assets2.razerzone.com/images/pnx.assets/6e3c3f7d0d0d0d0d0d0d0d0d0d0d0d0d/razer-huntsman-elite-gallery-1.jpg',
      category: 'Teclados',
      stock: 10,
      adminCI: '12345678'
    },
  
    // 🖱️ Mouse
    {
        id: 20,
        name: 'Logitech G502 HERO',
        description: 'Mouse con 11 botones programables y sensor HERO 25K.',
        price: 75,
        imageUrl: 'https://resource.logitechg.com/w_800,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png?v=1',
        category: 'Mouse',
        stock: 20,
        adminCI: '12345678'
      },
      {
        id: 21,
        name: 'SteelSeries Rival 600',
        description: 'Mouse con doble sensor óptico y pesos personalizables.',
        price: 80,
        imageUrl: 'https://media.steelseriescdn.com/thumbs/filer_public/0a/e5/0ae59cfb-14ff-496b-8083-cbc792d6e6c0/rival-600-product-image-1.png__1920x1080_q100_crop-fit_optimize_subsampling-2.png',
        category: 'Mouse',
        stock: 17,
        adminCI: '12345678'
      },
      {
        id: 22,
        name: 'Glorious Model O',
        description: 'Mouse ultraligero con diseño de panal y RGB.',
        price: 65,
        imageUrl: 'https://cdn.shopify.com/s/files/1/0558/6417/1778/products/1_86f6ebee-d650-4e3c-b740-c40376fd2322_800x.jpg?v=1671116354',
        category: 'Mouse',
        stock: 22,
        adminCI: '12345678'
      }
    ];

export interface Product {
  id: number | string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  name: string;
  adminCI: string;
  category: string;
}