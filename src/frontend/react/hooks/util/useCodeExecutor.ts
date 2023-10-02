/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const useCodeExecutor = (...paramNames: string[]): CodeExecutor => {
  return async (code: string, ...params: any[]) => {
    try {
      const codeExecutor = new AsyncFunction(...paramNames, code);
      return codeExecutor(...params);
    } catch (error) {
      return { error };
    }
  };
};

export type CodeExecutor = (
  code: string,
  ...params: any[]
) => Promise<CodeExecutionResult>;

export type CodeExecutionResult = {
  value?: any;
  error?: Error;
};
