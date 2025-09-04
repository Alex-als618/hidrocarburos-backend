# Diseño del Sistema – Backend Hidrocarburos

## 1. Propósito

Backend para la gestión de estaciones de combustible. Permite a usuarios consultar disponibilidad de combustibles y a administradores controlar usuarios, roles, imágenes y notificaciones.

## 2. Stack Tecnológico

- **NestJS** (Node.js)
- **PostgreSQL** (Base de datos)
- **TypeORM** (ORM)
- **JWT** (Autenticación)
- **Multer** (Subida de imágenes)
- **Helmet** (Seguridad HTTP)

> **Swagger**: No se utiliza, ya que la API no se documenta públicamente.

## 3. Principios de Diseño Aplicados

- **SOLID**: Clases con responsabilidad única y abiertas a extensión.
- **DRY**: Sin duplicación de lógica.
- **KISS**: Diseño simple y directo.
- **YAGNI**: Solo se implementa lo necesario.
- **Clean Code**: Código legible, modular y mantenible.

## 4. Arquitectura General

El backend sigue una arquitectura modular utilizando el patrón MVC para separación de responsabilidades. Cada módulo contiene sus controladores, servicios, entidades y DTOs.

NestJS permite inyectar dependencias y estructurar los módulos de forma aislada, facilitando pruebas unitarias y escalabilidad.

## 5. Resumen del Modelo de Datos

- **fuel_stations**: Estaciones de servicio con ubicación, dirección y datos generales.
- **fuel_types**: Tipos de combustibles disponibles (ej. gasolina, diésel, GLP).
- **fuel_availability**: Cantidades disponibles por tipo de combustible y estación.
- **users**: Usuarios del sistema con credenciales y rol asignado.
- **roles**: Roles como `admin`, `encargado` y `usuario` para control de permisos.
- **user_station_notifications**: Subscripciones de usuarios a estaciones para recibir notificaciones.
- **station_images**: Imágenes asociadas a estaciones (ej. fachada, surtidores, etc.).

## 6. Seguridad y Validación

- Autenticación mediante JWT.
- Validación de datos con `class-validator` y DTOs.
- Control de acceso basado en roles.
- Middleware de seguridad con `helmet`.
- Manejo de archivos controlado con `multer`.

## 8. Mantenimiento del Documento
Este diseño técnico debe actualizarse conforme evoluciona la arquitectura del sistema y los módulos implementados.