import React, { memo } from "react";
import { CodeEditorComponent } from "src/components/atoms/inputs/CodeEditor";
import { wrapContent } from "src/styles/layout";
import { ParameterEditorComponent } from "./ParameterEditor";

export enum FunctionExecutionMode {
  Idle,
  Executing,
  Success,
  Error,
}

export type FunctionEditorProps = {
  params: string[];
  code: string;
  mode: FunctionExecutionMode;
  onParamsChange?: (newParams: string[]) => void;
  onCodeChange?: (newCode: string) => void;
};

export const FunctionEditorComponent = memo(
  ({
    params,
    code,
    mode,
    onParamsChange,
    onCodeChange,
  }: FunctionEditorProps): JSX.Element => {
    const handleParamsChange = (newParams: string[]) => {
      if (onParamsChange) onParamsChange(newParams);
    };

    const handleCodeChange = (newCode: string) => {
      if (onCodeChange) onCodeChange(newCode);
    };

    return (
      <div
        style={{
          ...getStyle(mode),
        }}
      >
        <div
          style={{
            flexDirection: "column",
            display: "flex",
            padding: "0.5em",
            alignItems: "flex-start",
          }}
        >
          <ParameterEditorComponent
            value={params}
            onBlur={handleParamsChange}
          />
          <CodeEditorComponent code={code} onBlur={handleCodeChange} />
          <div className="code-font">{"}"}</div>
        </div>
      </div>
    );
  }
);

const getStyle = (mode: FunctionExecutionMode): React.CSSProperties => {
  switch (mode) {
    case FunctionExecutionMode.Idle:
      return defaultStyle;
    case FunctionExecutionMode.Executing:
      return executingStyle;
    case FunctionExecutionMode.Success:
      return successStyle;
    case FunctionExecutionMode.Error:
      return errorStyle;
  }
};

const defaultStyle: React.CSSProperties = {
  border: "1px solid rgba(0, 0, 0, 0.7)",
  borderRadius: "0.2em",
  ...wrapContent,
};

const executingStyle: React.CSSProperties = {
  // light yellow
  border: "1px solid rgba(255, 255, 0, 0.7)",
  borderRadius: "0.2em",
  ...wrapContent,
};

const successStyle: React.CSSProperties = {
  border: "1px solid rgba(75, 181, 67, 0.7)",
  borderRadius: "0.2em",
  ...wrapContent,
};

const errorStyle: React.CSSProperties = {
  border: "1px solid rgba(178, 34, 34, 0.7)",
  borderRadius: "0.2em",
  ...wrapContent,
};
