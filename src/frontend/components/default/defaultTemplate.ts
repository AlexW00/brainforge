import { Template } from "../../../core/data/models/flashcards/template/Template";

export const DEFAULT_TEMPLATE: Template = {
	name: "Japanese - English",
	id: "b8b2df54-7709-440b-9819-a1625038f1fa",
	thumbnail:
		"data:image/png;base64,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",
	graph: {
		nodes: [
			{
				position: {
					x: 150,
					y: -30,
				},
				id: "f2b7a3d4-66ea-49d6-9e78-4fad2c99d87d",
				type: "custom",
				data: {
					definitionId: "output-node",
					doReRunOnRender: false,
					data: {
						lastEditTs: 1718213628529,
					},
					io: {
						inputs: {
							front: {
								name: "front",
								type: {
									name: "any",
									color: "#000000",
								},
							},
							back: {
								name: "back",
								type: {
									name: "any",
									color: "#000000",
								},
							},
							"Side-3": {
								name: "Side-3",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
						outputs: {
							out: {
								name: "out",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
					},
				},
				width: 186,
				height: 193,
				selected: false,
				positionAbsolute: {
					x: 150,
					y: -30,
				},
				dragging: false,
			},
			{
				position: {
					x: -1155,
					y: -30,
				},
				id: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				type: "custom",
				data: {
					definitionId: "input-node",
					doReRunOnRender: false,
					data: {
						inputField: {
							id: "282093d3-3297-4f66-8b3a-ddfb09aae577",
							name: "Japanese",
							inputTypeId: "text",
						},
						lastEditTs: 1718213628529,
					},
					io: {
						inputs: {},
						outputs: {
							"output-1": {
								name: "Output",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
					},
				},
				width: 264,
				height: 163,
				selected: false,
				positionAbsolute: {
					x: -1155,
					y: -30,
				},
				dragging: false,
			},
			{
				position: {
					x: -570,
					y: 555,
				},
				id: "6687be4f-291d-4b46-bb34-0e56b5e20e68",
				type: "custom",
				data: {
					definitionId: "translate-node",
					doReRunOnRender: false,
					data: {
						lastEditTs: 1718213889265,
					},
					io: {
						inputs: {
							prompt: {
								name: "prompt",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
						outputs: {
							result: {
								name: "result",
								type: {
									name: "string",
									color: "#00ff00",
									allowedInputs: [
										{
											name: "any",
											color: "#000000",
										},
									],
								},
							},
						},
					},
				},
				width: 264,
				height: 151,
				selected: false,
				positionAbsolute: {
					x: -570,
					y: 555,
				},
				dragging: false,
			},
			{
				position: {
					x: -690,
					y: 135,
				},
				id: "b3d9c281-dd12-4cbb-993f-b352b5d2f707",
				type: "custom",
				data: {
					definitionId: "templating-node",
					doReRunOnRender: false,
					data: {
						template:
							"Generate an example sentence for the following japanese word: '{{Input-1}}'. Only reply with the example sentence.",
						lastEditTs: 1718413587187,
					},
					io: {
						inputs: {
							"Input-1": {
								name: "Input-1",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
						outputs: {
							out: {
								name: "out",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
					},
				},
				width: 242,
				height: 260,
				selected: false,
				positionAbsolute: {
					x: -690,
					y: 135,
				},
				dragging: false,
			},
			{
				position: {
					x: -375,
					y: 225,
				},
				id: "903e79db-f22d-43cb-a875-c8885dee433f",
				type: "custom",
				data: {
					definitionId: "openai-node",
					doReRunOnRender: false,
					data: {
						lastEditTs: 1718213889265,
					},
					io: {
						inputs: {
							prompt: {
								name: "prompt",
								type: {
									name: "any",
									color: "#000000",
								},
							},
						},
						outputs: {
							result: {
								name: "result",
								type: {
									name: "string",
									color: "#00ff00",
									allowedInputs: [
										{
											name: "any",
											color: "#000000",
										},
									],
								},
							},
						},
					},
				},
				width: 264,
				height: 151,
				selected: true,
				positionAbsolute: {
					x: -375,
					y: 225,
				},
				dragging: false,
			},
		],
		edges: [
			{
				source: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				sourceHandle: "output-1",
				target: "f2b7a3d4-66ea-49d6-9e78-4fad2c99d87d",
				targetHandle: "front",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-282093d3-3297-4f66-8b3a-ddfb09aae577output-1-f2b7a3d4-66ea-49d6-9e78-4fad2c99d87dfront",
			},
			{
				source: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				sourceHandle: "output-1",
				target: "6687be4f-291d-4b46-bb34-0e56b5e20e68",
				targetHandle: "prompt",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-282093d3-3297-4f66-8b3a-ddfb09aae577output-1-6687be4f-291d-4b46-bb34-0e56b5e20e68prompt",
			},
			{
				source: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				sourceHandle: "output-1",
				target: "b3d9c281-dd12-4cbb-993f-b352b5d2f707",
				targetHandle: "Input-1",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-282093d3-3297-4f66-8b3a-ddfb09aae577output-1-b3d9c281-dd12-4cbb-993f-b352b5d2f707Input-1",
			},
			{
				source: "6687be4f-291d-4b46-bb34-0e56b5e20e68",
				sourceHandle: "result",
				target: "f2b7a3d4-66ea-49d6-9e78-4fad2c99d87d",
				targetHandle: "Side-3",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-6687be4f-291d-4b46-bb34-0e56b5e20e68result-f2b7a3d4-66ea-49d6-9e78-4fad2c99d87dSide-3",
			},
			{
				source: "b3d9c281-dd12-4cbb-993f-b352b5d2f707",
				sourceHandle: "out",
				target: "903e79db-f22d-43cb-a875-c8885dee433f",
				targetHandle: "prompt",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-b3d9c281-dd12-4cbb-993f-b352b5d2f707out-903e79db-f22d-43cb-a875-c8885dee433fprompt",
			},
			{
				source: "903e79db-f22d-43cb-a875-c8885dee433f",
				sourceHandle: "result",
				target: "f2b7a3d4-66ea-49d6-9e78-4fad2c99d87d",
				targetHandle: "back",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-903e79db-f22d-43cb-a875-c8885dee433fresult-f2b7a3d4-66ea-49d6-9e78-4fad2c99d87dback",
			},
		],
	},
	viewport: {
		x: 1060.7444189483604,
		y: 216.50608290297288,
		zoom: 0.9342095913971521,
	},
};
