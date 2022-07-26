import { useState, useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Image } from "mui-image";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import axios from "axios";

const API_ENDPOINT = "http://localhost:5000";

// Change image url parameter to enhance quality
function manipulateImageURL(link) {
	const url = new URL(link);
	url.searchParams.set("p", "100");
	return url.href;
}

const productionColumns = [
	// { field: "_id", headerName: "ID", width: 100 },
	{ field: "name", headerName: "Name", minWidth: 150, flex: 0.9 },
	{ field: "category_name", headerName: "Category", minWidth: 150, flex: 0.9 },
	{ field: "synopsis", headerName: "Synopsis", minWidth: 200, flex: 1 },
	// {
	// 	field: "product_id",
	// 	headerName: "Product ID",
	// 	type: "number",
	// 	minWidth: 100,
	// 	flex: 0.5,
	// },
	// {
	// 	field: "series_id",
	// 	headerName: "Series ID",
	// 	type: "number",
	// 	minWidth: 100,
	// 	flex: 0.5,
	// },
	{
		field: "image_url",
		headerName: "Image",
		minWidth: 200,
		flex: 1,
		renderCell: (params) => {
			// return <img src={params.value} />;
			return (
				<Image src={manipulateImageURL(params.value)} aspectRatio={16 / 9} />
			);
		},
	},
];

const newColumns = [
	{ field: "title", headerName: "Name", minWidth: 150, flex: 0.9 },
	{ field: "subtitle", headerName: "Category", minWidth: 150, flex: 0.9 },
	{ field: "synopsis", headerName: "Synopsis", minWidth: 200, flex: 1 },
	{
		field: "image_url",
		headerName: "Image",
		minWidth: 200,
		flex: 1,
		renderCell: (params) => {
			return <Image src={params.value} />;
		},
	},
];

// export default function ListView() {
// 	const [data, setData] = useState([]);

// 	// This method fetches the records from the database.
// 	useEffect(() => {
// 		async function getData() {
// 			const response = await fetch(`http://localhost:5000/data/production`);

// 			if (!response.ok) {
// 				const message = `An error occurred: ${response.statusText}`;
// 				window.alert(message);
// 				return;
// 			}
// 			console.log("Hi");
// 			const records = await response.json();
// 			setData(records);
// 		}

// 		getData();

// 		return;
// 	}, [data.length]);

// 	return (
// 		<Box sx={{ height: "85vh", width: "100%" }}>
// 			<DataGrid
// 				rows={data}
// 				columns={productionColumns}
// 				getRowId={(row) => row._id}
// 				getRowHeight={() => "auto"}
// 				getEstimatedRowHeight={() => 200}
// 				disableSelectionOnClick
// 				sx={{ fontSize: "1em" }}
// 			/>
// 		</Box>
// 	);
// }

// // new is smaller
// // get matching title/name
// var matchingNewData = newData.filter((itemNew) =>
// 	productionData.some(
// 		(itemProduction) => itemProduction["title"] === itemNew["name"]
// 	)
// );
// // same matching for production data
// var matchingProductionData = matchingProductionData.filter(
// 	(itemProduction) =>
// 		matchingNewData.some(
// 			(itemNew) => itemProduction["title"] == itemNew["name"]
// 		)
// );

// fetch()
// 			.then((response) => response.json())
// 			.then((response) => {
// 				setData({productionData: response})

// 			})

// 		async function getData() {
// 			var response = await fetch(`http://localhost:5000/data/production`);

// 			if (!response.ok) {
// 				var message = `An error occurred: ${response.statusText}`;
// 				window.alert(message);
// 				return;
// 			}

// 			const productionRecords = await response.json();
// 			// console.log(records);

// 			response = await fetch(`http://localhost:5000/data/new`);

// 			if (!response.ok) {
// 				message = `An error occurred: ${response.statusText}`;
// 				window.alert(message);
// 				return;
// 			}

// 			const newRecords = await response.json();

// 			// get matching title/name
// 			console.log("Hi");
// 			// console.log(newRecords);
// 			// console.log(productionRecords);
// 			// console.log("no");
// 			// var matchingNewData = newRecords.filter((itemNew) =>
// 			// 	productionRecords.some(
// 			// 		(itemProduction) => itemProduction["title"] === itemNew["name"]
// 			// 	)
// 			// );
// 			// // console.log(matchingNewData);

// 			// var matchingProductionData = productionRecords.filter((itemProduction) =>
// 			// 	matchingNewData.some(
// 			// 		(itemNew) => itemProduction["title"] == itemNew["name"]
// 			// 	)
// 			// );
// 			// console.log(matchingProductionData);

// 			// same matching for production data but in same order

// 			// var matchingProductionData = [];
// 			// for (const itemNew of matchingNewData) {
// 			// 	var index = productionRecords
// 			// 		.map(function (obj) {
// 			// 			return obj["title"];
// 			// 		})
// 			// 		.indexOf(itemNew["name"]);
// 			// 	matchingProductionData.push(productionRecords[index]);
// 			// }

// 			setData({
// 				productionData: productionRecords,
// 				newData: newRecords,
// 			});
// 			// setData{{productionData: }}
// 		}

// 		getData();

export default function ListView() {
	const [newData, setNew] = useState([]);
	const [productionData, setProduction] = useState([]);

	const fetchData = () => {
		const getNew = axios.get(`${API_ENDPOINT}/data/new`);
		const getProduction = axios.get(`${API_ENDPOINT}/data/production`);
		axios.all([getNew, getProduction]).then(
			axios.spread((...allData) => {
				const allNewData = allData[0].data;
				const allProductionData = allData[1].data;
				// setNew(allNewData);
				// setProduction(allProductionData);
				var matchingNewData = allNewData.filter((itemNew) =>
					allProductionData.some(
						(itemProduction) => itemProduction["name"] === itemNew["title"]
					)
				);
				var matchingProductionData = matchingNewData.map((item) =>
					allProductionData.find((obj) => obj["name"] === item["title"])
				);

				setNew(matchingNewData);
				setProduction(matchingProductionData);
			})
		);
	};

	// This method fetches the records from the database.
	useEffect(() => {
		fetchData();
		return;
	}, []);

	return (
		<Grid container columnSpacing={5} sx={{ ml: "auto" }}>
			<Grid itmem xs={6}>
				<Typography
					component="h1"
					variant="h6"
					color="inherit"
					noWrap
					sx={{ flexGrow: 0.7 }}
				>
					Viu Production
				</Typography>
				<Paper>
					<Box sx={{ height: "85vh", width: "100%" }}>
						<DataGrid
							rows={productionData}
							columns={productionColumns}
							getRowId={(row) => row._id}
							getRowHeight={() => "auto"}
							getEstimatedRowHeight={() => 200}
							disableSelectionOnClick
							sx={{ fontSize: "1em" }}
						/>
					</Box>
				</Paper>
			</Grid>

			<Grid item xs={6}>
				<Typography
					component="h1"
					variant="h6"
					color="inherit"
					noWrap
					sx={{ flexGrow: 0.7 }}
				>
					Viu QA
				</Typography>
				<Paper>
					<Box sx={{ height: "85vh", width: "100%" }}>
						<DataGrid
							rows={newData}
							columns={newColumns}
							getRowId={(row) => row._id}
							getRowHeight={() => "auto"}
							getEstimatedRowHeight={() => 200}
							disableSelectionOnClick
							sx={{ fontSize: "1em" }}
						/>
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
