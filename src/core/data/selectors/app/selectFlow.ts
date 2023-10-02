import AppModel from "../../models/AppModel";
import FlowModel from "../../models/FlowModel";

export const selectFlow = (
  name: string,
  appModel: AppModel
): FlowModel | undefined => {
  return appModel.flows.find((f) => f.name === name);
};
