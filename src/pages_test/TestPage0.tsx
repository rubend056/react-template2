import Demo from "@common/Demo";
import Toolbar from "@common/organisms/Toolbar";
import Drawer from "@catoms/Drawer";
import Button from "@catoms/Button";

import Image from "@catoms/Image";
import DrawerTogglePreset from "src/common/molecules/DrawerTogglePreset";

const TestPage0 = (props) => {
	return (
		// <Drawer
		// 	drawer={
		// 		<>
		// 			<DrawerTogglePreset/>
		// 			<div>Hello there</div>
		// 		</>
		// 	}
		// 	sticky
		// >
		// 	<Toolbar
		// 		left={
		// 			<>
		// 				<DrawerTogglePreset />
		// 			</>
		// 		}
		// 		middle={
		// 			// <Image
		// 			// 	src='https://www.pngfind.com/pngs/b/687-6876191_spacex-png.png'
		// 			// 	style={{ maxWidth: 200 }}
		// 			// 	className='padding-v-3'
		// 			// />
		// 			`Test Page 0`
		// 		}
		// 		right={
		// 			<>
		// 				<Button>Login</Button>
		// 			</>
		// 		}
		// 	/>
		//  div style={{ textAlign: "center" }}>
		// 		<Demo />
		// </div>
		// </Drawer>
		<div style={{ textAlign: "center" }}>
			<Demo />
		</div>
	);
};

export default TestPage0;
