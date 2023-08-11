// como leer un json en ESModules recomendado por ahora
// y crear una funcion para reutilizarla y leer cualquier JSON
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export const readJSON = (path) => require(path);
