import mysql from 'mysql2/promise';
import { config } from "dotenv";

config(); // Cargar .env

const pool = mysql.createPool(process.env.MYSQL_URL);

async function seed() {
    try {
        console.log('Creando tablas...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS CategoriasComercio (
                id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                nombre_categoria VARCHAR(255)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Clientes (
                uid_cliente VARCHAR(255) PRIMARY KEY,
                mail VARCHAR(255),
                nombre VARCHAR(255),
                apellido VARCHAR(255),
                fecha_nacimiento DATE,
                domicilio VARCHAR(255),
                telefono VARCHAR(50),
                preferencias_alimentarias JSON,
                foto_perfil VARCHAR(255)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Comercios (
                uid_comercio VARCHAR(255) PRIMARY KEY,
                mail VARCHAR(255),
                nombre_comercio VARCHAR(255),
                id_categoria INT,
                descripcion TEXT,
                direccion VARCHAR(255),
                telefono VARCHAR(50),
                horario_apertura TIME,
                horario_cierre TIME,
                zonas_entrega VARCHAR(255),
                costo_entrega DECIMAL(10,2),
                metodos_pago VARCHAR(255),
                imagenes JSON,
                foto_perfil VARCHAR(255)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Productos (
                id_producto INT AUTO_INCREMENT PRIMARY KEY,
                uid_comercio VARCHAR(255),
                id_categoria INT,
                nombre VARCHAR(255),
                descripcion TEXT,
                precio DECIMAL(10,2),
                descuento DECIMAL(5,2),
                fecha_produccion DATE,
                fecha_vencimiento DATE,
                tipo VARCHAR(50),
                cantidad INT,
                activo BOOLEAN DEFAULT 1,
                imagenes JSON
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Resenas (
                uid_cliente VARCHAR(255),
                uid_comercio VARCHAR(255),
                puntuacion INT,
                comentario TEXT,
                PRIMARY KEY (uid_cliente, uid_comercio)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Reservas (
                id_reserva INT AUTO_INCREMENT PRIMARY KEY,
                uid_cliente VARCHAR(255),
                uid_comercio VARCHAR(255),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_expiracion TIMESTAMP,
                estado VARCHAR(50),
                fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                id_cliente VARCHAR(255)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS DetalleReserva (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_reserva INT,
                id_producto INT,
                cantidad INT,
                precio DECIMAL(10,2)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS Ventas (
                id_venta INT AUTO_INCREMENT PRIMARY KEY,
                id INT UNIQUE,
                uid_comercio VARCHAR(255),
                uid_cliente VARCHAR(255),
                comprador_id VARCHAR(255),
                total DECIMAL(10,2),
                metodo_pago VARCHAR(50),
                codigo_retiro VARCHAR(50),
                fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado VARCHAR(50)
            )
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS DetallesVenta (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_venta INT,
                venta_id INT,
                id_producto INT,
                producto_id INT,
                cantidad INT,
                cantidadCarrito INT,
                precio_unitario DECIMAL(10,2),
                subtotal DECIMAL(10,2)
            )
        `);

        console.log('Tablas creadas exitosamente. Insertando datos de prueba...');

        // Insertar Categorias
        await pool.query(`INSERT IGNORE INTO CategoriasComercio (id_categoria, nombre_categoria) VALUES 
            (1, 'Panadería'),
            (2, 'Restaurante'),
            (3, 'Supermercado'),
            (4, 'Verdulería'),
            (5, 'Pastelería')
        `);

        // Insertar Clientes
        await pool.query(`INSERT IGNORE INTO Clientes (uid_cliente, mail, nombre, apellido, fecha_nacimiento, domicilio, telefono) VALUES
            ('cliente_1', 'juan.perez@email.com', 'Juan', 'Perez', '1990-05-15', 'Calle Falsa 123', '1122334455'),
            ('cliente_2', 'maria.lopez@email.com', 'Maria', 'Lopez', '1985-10-22', 'Av. Siempreviva 742', '1199887766'),
            ('cliente_3', 'carlos.gomez@email.com', 'Carlos', 'Gomez', '1992-03-08', 'Rivadavia 450', '1144556677'),
            ('cliente_4', 'ana.martinez@email.com', 'Ana', 'Martinez', '1998-12-01', 'San Martin 800', '1155667788'),
            ('cliente_5', 'lucia.fernandez@email.com', 'Lucia', 'Fernandez', '1995-07-19', 'Belgrano 1200', '1166778899')
        `);

        // Insertar Comercios
        await pool.query(`INSERT IGNORE INTO Comercios (uid_comercio, mail, nombre_comercio, id_categoria, descripcion, direccion, telefono, horario_apertura, horario_cierre) VALUES
            ('comercio_1', 'contacto@panaderialosabuelos.com', 'Panadería Los Abuelos', 1, 'Las mejores medialunas de la ciudad. Salvando comida todos los dias!', 'Av. Corrientes 1500', '1123456780', '07:00', '20:00'),
            ('comercio_2', 'info@elclubdelamilanesa.com', 'El Club de la Milanesa', 2, 'Comida casera y abundante. Packs sorpresa al cierre.', 'Palermo Soho', '1123456781', '11:00', '23:30'),
            ('comercio_3', 'verduleriasanjose@email.com', 'Verdulería San José', 4, 'Frutas y verduras orgánicas. Cajas de rescate diario.', 'Caballito', '1123456782', '08:00', '21:00'),
            ('comercio_4', 'pasteleriadulce@email.com', 'Dulce Rincón', 5, 'Tortas y masas finas.', 'Recoleta', '1123456783', '09:00', '19:00'),
            ('comercio_5', 'supermercadoeco@email.com', 'Supermercado Eco', 3, 'Productos a punto de vencer a precios increíbles.', 'Almagro', '1123456784', '08:00', '22:00')
        `);

        // Insertar Productos
        await pool.query(`INSERT INTO Productos (uid_comercio, id_categoria, nombre, descripcion, precio, descuento, fecha_produccion, fecha_vencimiento, tipo, cantidad, activo) VALUES
            ('comercio_1', 1, 'Pack Sorpresa Panadería', 'Incluye medialunas, pan y facturas variadas del día.', 1500.00, 50, '2026-10-07', '2026-10-08', 'pack', 5, 1),
            ('comercio_1', 1, 'Docena de Empanadas', 'Empanadas de carne y pollo de ayer.', 3000.00, 40, '2026-10-06', '2026-10-08', 'individual', 2, 1),
            ('comercio_2', 2, 'Vianda Milanesa con Puré', 'Milanesa napolitana con puré de papas. Excedente del mediodía.', 2500.00, 30, '2026-10-07', '2026-10-08', 'individual', 10, 1),
            ('comercio_2', 2, 'Pack Sorpresa Almuerzo', 'Comida variada del buffet.', 2000.00, 60, '2026-10-07', '2026-10-08', 'pack', 3, 1),
            ('comercio_3', 4, 'Caja de Verduras Variadas', 'Verduras con detalles estéticos pero en perfecto estado.', 1200.00, 70, '2026-10-05', '2026-10-10', 'pack', 8, 1),
            ('comercio_3', 4, 'Bolsa de Frutas (Bananas y Manzanas)', 'Fruta madura ideal para licuados o repostería.', 800.00, 60, '2026-10-05', '2026-10-09', 'pack', 15, 1),
            ('comercio_4', 5, 'Porción Torta de Chocolate', 'Ultima porción del día.', 1000.00, 50, '2026-10-06', '2026-10-08', 'individual', 4, 1),
            ('comercio_4', 5, 'Caja de Alfajores de Maicena', '12 alfajores de maicena.', 1800.00, 40, '2026-10-05', '2026-10-09', 'pack', 2, 1),
            ('comercio_5', 3, 'Lácteos Cercanos a Vencimiento', 'Yogures y quesos varios.', 2500.00, 50, '2026-10-01', '2026-10-08', 'pack', 6, 1),
            ('comercio_5', 3, 'Fiambres Surtidos', 'Recortes de fiambrería.', 1500.00, 60, '2026-10-06', '2026-10-09', 'pack', 4, 1)
        `);

        console.log('¡Base de datos sembrada con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('Error sembrando la base de datos:', error);
        process.exit(1);
    }
}

seed();
