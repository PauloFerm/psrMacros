# PSR Macros
Macros para elaborar sistemas de calefacción implemetado en Google Sheets. 

## Cómo utilizar
Se encuentra compartido el formato de [planilla de cálculo](https://docs.google.com/spreadsheets/d/1EihQzL0wmr5lAutq1UZfNjEbWYJYsOliuQSvo2HlxEc/edit?usp=sharing) con macros incorporadas.

## Dev
La transpilación se Typescript a GoogleAppsScript se realiza de manera automática a través de [clasp](https://github.com/google/clasp), no es necesario transpilar el proyecto previo al deploy.

### Numeración de directorios `src/` y archivos
La numeración se utiliza para que clasp transpile e importe variables globales y namespaces en el orden requerido para satisfacer dependencias.

### Deploy entre múltiples proyectos
```bash
npm run menu
```
