import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  Grid,
  Text,
} from "@chakra-ui/react";
import React from "react";

export type SliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  name?: string;
  min?: number;
  max?: number;
  step?: number;
  doShowNumberInput?: boolean;
};

export function SliderPropertyComponent({
  value,
  name = "",
  onChange,
  min = 0,
  max = 100,
  step = 1,
}: SliderInputProps): JSX.Element {
  const handleChange = (value: number) => onChange(value);

  return (
    <Grid templateColumns="1fr 1fr" minHeight={"1em"} width="100%">
      <Slider
        flex="1"
        focusThumbOnChange={false}
        value={value}
        min={min}
        max={max}
        step={step}
        height={"100%"}
        minWidth="100px"
        size={"lg"}
        onChange={handleChange}
        gridColumn="1 / 3"
        gridRow={"1 / 1"}
      >
        <SliderTrack
          height={"100%"}
          onClick={(e) => {
            console.log("click t");
            e.stopPropagation();
            e.preventDefault();
            // @todo: disable clicking to set value
          }}
        >
          <SliderFilledTrack height={"100%"} />
        </SliderTrack>
      </Slider>

      <Text
        // float over the slider on left side
        zIndex={1}
        gridColumn="1 / 1"
        gridRow={"1 / 1"}
        pointerEvents="none"
        alignSelf="center"
        textAlign={"left"}
        marginLeft={"0.2em"}
      >
        {name}
      </Text>

      <Text
        // float over the slider on left side
        zIndex={1}
        gridColumn="2 / 2"
        gridRow="1 / 1"
        alignSelf="center"
        textAlign={"right"}
        pointerEvents="none"
        marginRight={"0.2em"}
      >
        {value}
      </Text>
    </Grid>
  );
}
