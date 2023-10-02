import React from "react";

type DragbarProps = {
  name: string;
  color?: string;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
};

export const DragbarComponent = ({
  name,
  color,
  isCollapsed,
  setIsCollapsed,
}: DragbarProps): JSX.Element => {
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div
      style={{
        alignItems: "center",
        height: "1.2rem",
        backgroundColor: color ?? "rgba(0,0,0,0.1)",
        padding: "0.15rem",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* todo: add collapse listener again and change this shit */}
      {isCollapsed ? ">" : "<"}
      <div>{name}</div>
    </div>
  );
};
