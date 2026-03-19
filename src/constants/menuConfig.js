import { ROUTES } from './routes';
import { ROLES } from './roles';

export const MENU_CONFIG = {
  [ROLES.PRODUTOR]: [
    { label: 'Dashboard', path: ROUTES.APP_DASHBOARD },
    { label: 'Relatórios', path: ROUTES.APP_RELATORIOS },
    { label: 'Perfil', path: ROUTES.APP_PERFIL },
  ],

  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Usuários', path: ROUTES.ADMIN_USUARIOS },
    { label: 'Upload', path: ROUTES.ADMIN_UPLOAD },
    { label: "Comissões", path: ROUTES.ADMIN_COMISSOES },
  ],
};