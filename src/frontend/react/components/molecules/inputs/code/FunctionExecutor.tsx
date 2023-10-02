import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import React, { memo, useEffect } from "react";
import { useCodeExecutor } from "src/react/hooks/util/useCodeExecutor";
import { shallowCompareArrays } from "src/util/shallowCompareArrays";

export type FunctionExecutorProps = {
  paramsDefinition: string[];
  paramsData: any[];
  code: string;
  onExecuteBegin?: () => void;
  onExecuteError?: (error: Error) => void;
  onExecuteSuccess?: (result: any) => void;
};

const areEqual = (a: FunctionExecutorProps, b: FunctionExecutorProps) => {
  const codeIsEqual = a.code === b.code,
    paramsDefinitionIsEqual = a.paramsDefinition === b.paramsDefinition,
    paramsDataIsEqual = shallowCompareArrays(a.paramsData, b.paramsData);
  console.log(
    "areEqual",
    codeIsEqual,
    paramsDefinitionIsEqual,
    paramsDataIsEqual
  );
  return codeIsEqual && paramsDefinitionIsEqual && paramsDataIsEqual;
};

export const FunctionExecutorComponent = memo(
  ({
    paramsDefinition,
    paramsData,
    code,
    onExecuteBegin,
    onExecuteError,
    onExecuteSuccess,
  }: FunctionExecutorProps): JSX.Element => {
    const codeExecutor = useCodeExecutor(...paramsDefinition);
    const [error, setError] = React.useState<Error | null>(null);

    useEffect(() => {
      onExecuteBegin && onExecuteBegin();
      console.log("Executing code", code);
      codeExecutor(code, ...paramsData)
        .then((result) => {
          setError(null);
          onExecuteSuccess && onExecuteSuccess(result);
        })
        .catch((error) => {
          setError(error);
          onExecuteError && onExecuteError(error);
        });
    }, [code, paramsDefinition, paramsData]);

    return error ? (
      <Alert status="error" maxHeight="2.5em" borderRadius="0.3em">
        <AlertIcon />
        <AlertTitle>{error.name}:</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    ) : (
      <></>
    );
  },
  areEqual
);
