import { Template } from "../../../core/data/models/flashcards/template/Template";

export const DEFAULT_TEMPLATE: Template = {
	id: "b8b2df54-7709-440b-9819-a1625038f1fa",
	name: "Japanese - English",
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
	_id: "template:b8b2df54-7709-440b-9819-a1625038f1fa",
	_rev: "9-c1c2038ac2d16dd75b5b13d327a792bc",
};
