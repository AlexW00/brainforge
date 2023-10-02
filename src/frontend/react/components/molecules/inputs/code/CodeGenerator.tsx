import { Input } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

export type CodeGeneratorProps = {
  paramsDefinition: string[];
  onCodeGenerate: (code: string) => void;
};

enum RequestState {
  IDLE,
  PENDING,
  ERROR,
}

export function CodeGeneratorComponent({
  paramsDefinition,
  onCodeGenerate,
}: CodeGeneratorProps): JSX.Element {
  const [promptInput, setPromptInput] = useState<string>("");
  const [requestState, setRequestState] = useState<RequestState>(
    RequestState.IDLE
  );

  // returns the body of an normal javascript function
  const getFunctionBody = (code: string) => {
    console.log("code", code);
    const functionBodyStart = code.indexOf("{") + 1;
    const functionBodyEnd = code.lastIndexOf("}");
    // return without the brackets
    return code.substring(functionBodyStart + 1, functionBodyEnd - 1).trim();
  };

  const createPrompt = (paramsDefinition: string[], prompt: string) => {
    const parameters =
      paramsDefinition.length > 0
        ? "(" + paramsDefinition.join(", ") + ") as"
        : "no";
    return `Generate a complete JavaScript function that accepts ${parameters} parameter${
      paramsDefinition.length > 1 ? "s" : ""
    } and does the following: '${prompt}'.`;
  };

  const handlePromptChange = async () => {
    if (requestState !== RequestState.PENDING) {
      if (promptInput.length > 3) {
        setRequestState(RequestState.PENDING);
        const API_KEY = import.meta.env.VITE_OPENAI_KEY;
        const configuration = new Configuration({
          apiKey: API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const prompt = createPrompt(paramsDefinition, promptInput);
        console.log("prompt", prompt);
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.5,
          max_tokens: 300,
        });

        if (response.data.choices.length > 0) {
          setRequestState(RequestState.IDLE);
          onCodeGenerate(getFunctionBody(response.data.choices[0].text));
        } else {
          setRequestState(RequestState.ERROR);
        }
      }
    }
  };

  const getBorderColor = () => {
    switch (requestState) {
      case RequestState.IDLE:
        return "gray.300";
      case RequestState.PENDING:
        return "orange.300";
      case RequestState.ERROR:
        return "red.300";
    }
  };

  return (
    <Input
      placeholder="Code description"
      value={promptInput}
      onChange={(e) => setPromptInput(e.target.value)}
      onBlur={handlePromptChange}
      size="xs"
      borderColor={getBorderColor()}
    />
  );
}
