import AppModel from "../../models/AppModel";
import EditorModel from "../../models/EditorModel";

export const selectEditor = (
  flowName: string,
  app: AppModel
): EditorModel | undefined => {
  return app.flows.find((f) => f.name === flowName)?.editorModel;
};
