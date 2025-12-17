# Gestor de Tareas – Proyecto Full Stack en Java

## Descripción

Aplicación web full stack desarrollada con Java y Spring Boot que permite gestionar tareas de forma sencilla. El usuario
puede crear, visualizar, marcar como completadas y eliminar tareas desde una interfaz web, con persistencia en una base
de datos relacional SQL.

## Funcionalidades

Crear tareas

Listar tareas

Marcar tareas como completadas / no completadas

Eliminar tareas

Persistencia en base de datos SQL

Interfaz web simple y funcional

## Tecnologías utilizadas

### Backend

Java 17

Spring Boot

Spring Web

Spring Data JPA

Hibernate

### Frontend

HTML5

CSS3

JavaScript (Vanilla JS)

Consumo de API REST mediante Fetch

### Base de datos

H2 (base de datos relacional SQL)

Visualización mediante consola H2 y DBeaver

Herramientas

IntelliJ IDEA

Maven

Git y GitHub

## Cómo ejecutar el proyecto

### Requisitos

Java 17

Maven

IntelliJ IDEA o IDE compatible

### Pasos

Clonar el repositorio: `git clone https://github.com/tu-usuario/taskmanager.git`

Abrir el proyecto en IntelliJ IDEA

Ejecutar la clase: `TaskmanagerApplication.java`

URL para acceder a la aplicación: `http://localhost:8080/index.html`

## Base de datos

La aplicación utiliza una base de datos H2 en modo fichero, creada automáticamente al arrancar el proyecto.

Consola H2: `http://localhost:8080/h2-console`

JDBC URL: `jdbc:h2:file:./data/taskdb`

## Posibles mejoras

Migración a MySQL

Autenticación de usuarios

Filtros de tareas

Mejora de la interfaz

Despliegue en la nube

## Autor

Santi Desarrollador Full Stack Junior