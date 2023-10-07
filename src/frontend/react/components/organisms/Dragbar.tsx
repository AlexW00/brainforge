import React from "react";

type DragbarProps = {
	name: string;
};

export const DragbarComponent = ({ name }: DragbarProps): JSX.Element => {
	return (
		<div
			style={{
				alignItems: "center",
				height: "1.2rem",
				backgroundColor: "rgba(0,0,0,0.1)",
				padding: "0.15rem",
				display: "flex",
				flexDirection: "row",
			}}
		>
			{name}
		</div>
	);
};
