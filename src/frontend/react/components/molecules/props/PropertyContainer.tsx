import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export type PropertyContainerProps = {
  name?: string;
  children: React.ReactNode;
};

export const PropertyContainerComponent = ({
  name,
  children,
}: PropertyContainerProps): JSX.Element => {
  return (
    <Flex direction={"column"} gap=".25em">
      {name && <Text textAlign={"left"}>{name}</Text>}
      {children}
    </Flex>
  );
};
