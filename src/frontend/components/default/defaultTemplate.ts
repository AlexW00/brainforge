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
					x: -120,
					y: 0,
				},
				id: "f2b7a3d4-66ea-49d6-9e78-4fad2c99d87d",
				type: "custom",
				data: {
					definitionId: "output-node",
					doReRunOnRender: false,
					data: {},
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
				height: 168,
				selected: true,
				positionAbsolute: {
					x: -120,
					y: 0,
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
					x: -450,
					y: 330,
				},
				id: "dfb10500-f7f5-40e5-90fa-d38125098a39",
				type: "custom",
				data: {
					definitionId: "openai-node",
					doReRunOnRender: false,
					data: {
						model: "gpt-4-turbo-preview",
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
					x: -450,
					y: 330,
				},
				dragging: false,
			},
			{
				position: {
					x: -780,
					y: 240,
				},
				id: "b149f440-debd-4a81-90ca-5545e6b6efcf",
				type: "custom",
				data: {
					definitionId: "templating-node",
					doReRunOnRender: false,
					data: {
						template:
							'Translate "{{Input-1}}" to English.\nOnly reply with the translation.',
						lastEditTs: 1718213631102,
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
					x: -780,
					y: 240,
				},
				dragging: false,
			},
		],
		edges: [
			{
				source: "282093d3-3297-4f66-8b3a-ddfb09aae577",
				sourceHandle: "output-1",
				target: "b149f440-debd-4a81-90ca-5545e6b6efcf",
				targetHandle: "Input-1",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-282093d3-3297-4f66-8b3a-ddfb09aae577output-1-b149f440-debd-4a81-90ca-5545e6b6efcfInput-1",
			},
			{
				source: "b149f440-debd-4a81-90ca-5545e6b6efcf",
				sourceHandle: "out",
				target: "dfb10500-f7f5-40e5-90fa-d38125098a39",
				targetHandle: "prompt",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-b149f440-debd-4a81-90ca-5545e6b6efcfout-dfb10500-f7f5-40e5-90fa-d38125098a39prompt",
			},
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
				source: "dfb10500-f7f5-40e5-90fa-d38125098a39",
				sourceHandle: "result",
				target: "f2b7a3d4-66ea-49d6-9e78-4fad2c99d87d",
				targetHandle: "back",
				type: "smoothstep",
				animated: true,
				id: "reactflow__edge-dfb10500-f7f5-40e5-90fa-d38125098a39result-f2b7a3d4-66ea-49d6-9e78-4fad2c99d87dback",
			},
		],
	},
	viewport: {
		x: 1056.125173247969,
		y: 363.1043054187997,
		zoom: 0.853172325264319,
	},
};
