import AppModel from "../../models/AppModel";
import FlowModel from "../../models/FlowModel";
import { findFlowIndex } from "../../selectors/app/findFlowIndex";

export const setFlow = (flow: FlowModel, appModel: AppModel) => {
  const flowIndex = findFlowIndex(flow.name, appModel);
  if (flowIndex !== -1) appModel.flows[flowIndex] = flow;
  else appModel.flows.push(flow);
};
