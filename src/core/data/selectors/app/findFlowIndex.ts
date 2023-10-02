import AppModel from "../../models/AppModel";

export const findFlowIndex = (name: string, app: AppModel): number => {
  return app.flows.findIndex((f) => f.name === name);
};
