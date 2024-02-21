import BeveledCone from '../../assets/img/abstract/beveled-cone.png';
import CloudBall from '../../assets/img/abstract/cloud-ball.png';
import Quadrilateral from '../../assets/img/abstract/quadrilateral.png';
import HardSharpDonut from '../../assets/img/abstract/hald-sharp-donut.png';
import BendyRectangle from '../../assets/img/abstract/bendy-rectangle.png';
import Infinity from '../../assets/img/abstract/infinity.png';
import Octahedron from '../../assets/img/abstract/octahedron.png';
import Triangle from '../../assets/img/abstract/triangle.png';
import SquiglyGlobe from '../../assets/img/abstract/squigly-globe.png';
import Dodecagon from '../../assets/img/abstract/dodecagon.png';
import BeveledCube from '../../assets/img/abstract/beveled-cube.png';
import Cylinder from '../../assets/img/abstract/cylinder.png';

const data = [
	{
		id: 1,
		image: BeveledCone,
		name: 'Beveled Cone',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "purple",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		device: '867035048259331',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [25, 66, 41, 89, 63],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 380,
		price: 14.5,
		store: 'danger',
		file: 'Figma',
	},
	{
		id: 2,
		image: CloudBall,
		name: 'Cloud Ball',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "indigo",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Unlocked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [12, 24, 33, 12, 48],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 1245,
		price: 12,
		store: 'Company A',
		file: 'Figma',
		device: '867035048259332'
	},
	{
		id: 3,
		image: Quadrilateral,
		name: 'Quadrilateral',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "hotpink",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [34, 32, 36, 34, 34],
			},
		],
		// color: process.env.REACT_APP_WARNING_COLOR,
		stock: 27,
		price: 12.8,
		store: 'Company D',
		file: 'XD',
		device: '867035048259333'
	},
	{
		id: 4,
		image: HardSharpDonut,
		name: 'Bendy Rectangle',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "blue",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [54, 34, 42, 23, 12],
			},
		],
		// color: process.env.REACT_APP_DANGER_COLOR,
		stock: 219,
		price: 16,
		store: 'Company C',
		file: 'Sketch',
		device: '867035048259334'
	},
	{
		id: 5,
		image: BendyRectangle,
		name: 'Bendy Rectangle',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Unlocked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [23, 21, 12, 34, 14],
			},
		],
		// color: process.env.REACT_APP_DANGER_COLOR,
		stock: 219,
		price: 16,
		store: 'Company A',
		file: 'Figma',
		device: '867035048259335'
	},
	{
		id: 6,
		image: Infinity,
		name: 'Bendy Rectangle',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [23, 13, 34, 41, 38],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 219,
		price: 16,
		store: 'Company C',
		file: 'Figma',
		device: '867035048259336'
	},
	{
		id: 7,
		image: Octahedron,
		name: 'Octahedron',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [21, 34, 23, 12, 67],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 498,
		price: 18,
		store: 'Company B',
		file: 'Figma',
		device: '867035048259337'
	},
	{
		id: 8,
		image: Triangle,
		name: 'Triangle',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [18, 32, 26, 15, 34],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 219,
		price: 16,
		store: 'Company B',
		file: 'Figma',
		device: '867035048259338'
	},
	{
		id: 9,
		image: SquiglyGlobe,
		name: 'SquiglyGlobe',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [18, 32, 26, 15, 34],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 219,
		price: 16,
		store: 'Company C',
		file: 'Figma',
		device: '867035048259339'
	},
	{
		id: 10,
		image: Dodecagon,
		name: 'Dodecagon',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [18, 32, 26, 15, 34],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 219,
		price: 16,
		store: 'Company A',
		file: 'Figma',
		device: '867035048259340'
	},
	{
		id: 11,
		image: BeveledCube,
		name: 'Beveled Cube',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [18, 32, 26, 15, 34],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 219,
		price: 16,
		store: 'Company A',
		file: 'Figma',
		device: '867035048259341'
	},
	{
		id: 12,
		image: Cylinder,
		name: 'Cylinder',
		licensePlates: '41BBEB',
		vin: '5YNWAHBB1NS070206',
		color: "green",
		company: 'WeMoke',
		fleet: 'Miami Beach Garage at 1212 Lincoln Road- 5th Floor',
		status: 'Available',
		deviceStatus: 'Locked',
		actionsButton: ["Lock", "Unlock", "Search", "Edit", "Delete"],
		category: '3D Shapes',
		series: [
			{
				data: [18, 32, 26, 15, 34],
			},
		],
		// color: process.env.REACT_APP_SUCCESS_COLOR,
		stock: 219,
		price: 16,
		store: 'Company B',
		file: 'Figma',
		device: '867035048259342'
	},
];
export default data;
