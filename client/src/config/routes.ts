import { ROUTES } from "@/constants/routes";

export const routeConfig = {
  public: [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP],
  protected: [ROUTES.DASHBOARD, ROUTES.EMERGENCY, ROUTES.DANGER_MODE, ROUTES.HISTORY, ROUTES.PROFILE, ROUTES.SETTINGS],
} as const;
