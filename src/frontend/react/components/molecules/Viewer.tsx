import React from "react";
// import ReactJson from "react-json-view";
import { ObjectViewerComponent } from "../atoms/viewers/ObjectViewer";
import { WebViewerComponent } from "../atoms/viewers/WebViewer";

export type ViewerProps = {
  value: any;
};

export enum ViewType {
  String,
  Json,
  Html,
  Image,
  Url,
  Object,
  Unknown,
}

const getViewType = (value: any): ViewType => {
  if (typeof value === "string") {
    if (value.startsWith("http")) {
      return ViewType.Url;
    }
    try {
      JSON.parse(value);
      return ViewType.Json;
    } catch (e) {
      if (value.startsWith("<")) {
        return ViewType.Html;
      } else {
        return ViewType.String;
      }
    }
  } else if (typeof value === "object") {
    if (value instanceof Image) return ViewType.Image;
    else return ViewType.Object;
  } else {
    return ViewType.Unknown;
  }
};

export const ViewerComponent = ({ value }: ViewerProps): JSX.Element => {
  const viewType = getViewType(value);

  const getContent = (viewType: ViewType, value: any): JSX.Element => {
    switch (viewType) {
      case ViewType.String:
        return <div>{value}</div>;
      case ViewType.Json:
        return <ObjectViewerComponent object={value} />;
      case ViewType.Html:
        return <div dangerouslySetInnerHTML={{ __html: value }} />;
      case ViewType.Image:
        return <img src={value} />;
      case ViewType.Url:
        return <WebViewerComponent url={value} />;
      case ViewType.Object:
        return <ObjectViewerComponent object={value} />;
      case ViewType.Unknown:
        return <div>{value}</div>;
    }
  };
  return <div>{getContent(viewType, value)}</div>;
};
