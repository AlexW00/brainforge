import React, { memo, useCallback } from "react";
import { DynamicInputComponent } from "../../../atoms/inputs/DynamicInput";

export type ParameterEditorProps = {
  value: string[];
  onChange?: (newValue: string[]) => void;
  onBlur?: (newValue: string[]) => void;
};

export const ParameterEditorComponent = memo(
  ({ value, onChange, onBlur }: ParameterEditorProps): JSX.Element => {
    const [valueBuffer, setValueBuffer] = React.useState<string>(
      value.join(", ")
    );
    // update valueBuffer when value changes
    React.useEffect(() => {
      setValueBuffer(value.join(", "));
    }, [value]);

    const parseParams = useCallback(
      (params: string): string[] => {
        return params
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
      },
      [value]
    );

    const handleChange = (newValue: string) => {
      setValueBuffer(newValue);
      if (onChange) onChange(parseParams(newValue));
    };

    const handleBlur = () => {
      if (onBlur) onBlur(parseParams(valueBuffer));
    };

    return (
      <div style={{ flexDirection: "row", display: "flex" }}>
        <div className="code-font">{"("}</div>
        <DynamicInputComponent
          value={valueBuffer}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="code-font">{") => {"}</div>
      </div>
    );
  }
);
