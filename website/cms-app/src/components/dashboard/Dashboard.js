import * as React from "react";
import { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems } from "./listItems";

import CircularProgress from "@mui/material/CircularProgress";

// import ListView from "./DataList";
// import CollapsibleTable from "./ImprovedDataList";
import NewerTable from "./NewerDataList";
import AnotherCollapsibleTable from "./AnotherList";
// import NewListView from "./NewDataList";

function Copyright(props) {
	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}
		>
			{"Copyright © James Tcheng "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

const mdTheme = createTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 900,
			lg: 1200,
			xl: 1536,
		},
	},
});

function DashboardContent() {
	const [open, setOpen] = React.useState(true);
	const toggleDrawer = () => {
		setOpen(!open);
	};

	return (
		<ThemeProvider theme={mdTheme}>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar position="absolute" open={open}>
					<Toolbar
						sx={{
							pr: "24px", // keep right padding when drawer closed
						}}
					>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: "36px",
								...(open && { display: "none" }),
							}}
						>
							<MenuIcon />
						</IconButton>
						<Typography
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}
						>
							Dashboard
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer variant="permanent" open={open}>
					<Toolbar
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
						}}
					>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeftIcon />
						</IconButton>
					</Toolbar>
					<Divider />
					<List component="nav">{mainListItems}</List>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: "100vh",
						overflow: "auto",
					}}
				>
					<Toolbar />
					<Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
						{/* <Grid container rowSpacing={4}> */}
						{/* Chart */}
						{/* <Grid item xs={12} md={8} lg={9}>
								<Paper
									sx={{
										p: 2,
										display: "flex",
										flexDirection: "column",
										height: 240,
									}}
								>
									<Chart />
								</Paper>
							</Grid> */}

						{/* Recent Deposits */}
						{/* <Grid item xs={12} md={4} lg={3}>
								<Paper
									sx={{
										p: 2,
										display: "flex",
										flexDirection: "column",
										height: 240,
									}}
								>
									<Deposits />
								</Paper>
							</Grid> */}

						{/* sx={{ p: 2, display: "flex", flexDirection: "column" }} */}
						{/* <Grid item xs={12}>
								<Paper>
									<div style={{ height: "50vh", width: "100%" }}>
										<div style={{ display: "flex", height: "100%" }}>
											<div style={{ flexGrow: 1 }}>
												<DataGrid rows={rows} columns={columns} />
											</div>
										</div>
									</div>
								</Paper>
							</Grid> */}

						{/* <CollapsibleTable></CollapsibleTable> */}
						{/* <Box sx={{ display: "flex" }}>
							<CircularProgress></CircularProgress>
						</Box> */}
						<NewerTable></NewerTable>
						{/* <Grid item xs={12}>
								<Paper>
									<NewListView></NewListView>
								</Paper>
							</Grid> */}
						{/* </Grid> */}
					</Container>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default function Dashboard() {
	return <DashboardContent />;
}
