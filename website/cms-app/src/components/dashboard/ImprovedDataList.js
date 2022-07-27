import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import { Image } from "mui-image";
import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";

import axios from "axios";
import { useState, useEffect } from "react";

var stringSimilarity = require("string-similarity");

function getStringSimilarity(s1, s2) {
	return stringSimilarity.compareTwoStrings(s1 || "", s2 || "");
}
function round3dp(num) {
	return Math.round(num * 1000) / 10;
}

// const levenshtein = require("js-levenshtein");
// function similarity(s1, s2) {
// 	if (s1 === null) {
// 		s1 = "";
// 	}
// 	if (s2 === null) {
// 		s2 = "";
// 	}
// 	if (s1 == s2) {
// 		return 1;
// 	}
// 	var longer = s1.length > s2.length ? s1 : s2;
// 	var shorter = s1.length <= s2.length ? s1 : s2;

// 	console.log(longer);
// 	console.log(shorter);
// 	return (longer.length - levenshtein(s1, s2)) / parseFloat(longer.length);
// }

const API_ENDPOINT = "http://localhost:5000";

function manipulateImageURL(link) {
	const url = new URL(link);
	url.searchParams.set("p", "100");
	return url.href;
}

// function createData() {
// 	return {
// 		// id,
// 		matching: true,
// 		newData: {
// 			_id: "543",
// 			title: "thisTitle",
// 			subtitle: "thisSubtitle",
// 		},
// 		productionData: {
// 			_id: "12",
// 			name: "bruh",
// 			category_name: "moreBruh",
// 		},
// 	};
// }

function Row(props) {
	const { row } = props;
	const [open, setOpen] = useState(false);

	var synopsisMatch = getStringSimilarity(
		row.newData.synopsis,
		row.productionData.synopsis
	);
	var categoryMatch = getStringSimilarity(
		row.newData.subtitle,
		row.productionData.category_name
	);
	var overallSimilarity = round3dp((synopsisMatch + categoryMatch) / 2);
	synopsisMatch = round3dp(synopsisMatch);
	categoryMatch = round3dp(categoryMatch);

	function getChipColor(similarity) {
		return similarity === 100
			? "success"
			: similarity > 75
			? "warning"
			: "error";
	}

	return (
		<React.Fragment>
			<TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					<Typography style={{ fontWeight: 550 }} noWrap>
						{row.newData.title}
					</Typography>
				</TableCell>
				<TableCell align="center">
					<Chip
						label={overallSimilarity + "%"}
						variant="outlined"
						color={getChipColor(overallSimilarity)}
					/>
					{/* <Box sx={{ background: "blue", cornerRadius: "50" }}>
						{}
						%
					</Box> */}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box
							sx={{ margin: 1, padding: 1, borderRadius: 3 }}
							style={{ background: "#DBF1FF" }}
						>
							<Table
								size="small"
								aria-label="caption"
								style={{ width: "auto", tableLayout: "auto" }}
							>
								<caption>
									Product ID: {row.productionData.product_id} | Series ID:{" "}
									{row.productionData.series_id}
								</caption>
								<TableHead>
									<TableRow>
										<TableCell></TableCell>
										<TableCell>
											<Typography>Title </Typography>
										</TableCell>
										<TableCell>
											<Typography>
												Category{"  "}
												<Chip
													label={categoryMatch + "%"}
													variant="filled"
													size="small"
													color={getChipColor(categoryMatch)}
												/>
											</Typography>
										</TableCell>
										<TableCell>
											<Typography>
												Synopsis{"  "}
												<Chip
													label={synopsisMatch + "%"}
													variant="filled"
													size="small"
													color={getChipColor(synopsisMatch)}
												/>
											</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography>Image</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>QA</TableCell>
										<TableCell style={{ whiteSpace: "nowrap" }}>
											{row.newData.title}
										</TableCell>
										<TableCell>{row.newData.subtitle}</TableCell>
										<TableCell>{row.newData.synopsis}</TableCell>
										<TableCell>
											<Image
												src={row.newData.image_url}
												duration={1500}
												width={350}
												sx={{
													maxWidth: { xs: 350, md: 300 },
												}}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>Viu</TableCell>
										<TableCell style={{ whiteSpace: "nowrap" }}>
											{row.productionData.name ===
											row.productionData.series_name ? (
												<p>{row.productionData.name}</p>
											) : (
												<p>
													{row.productionData.name} |{" "}
													{row.productionData.series_name}
												</p>
											)}
										</TableCell>
										<TableCell>{row.productionData.category_name}</TableCell>
										<TableCell>{row.productionData.synopsis}</TableCell>
										<TableCell>
											<Image
												src={manipulateImageURL(row.productionData.image_url)}
												duration={1500}
												width={350}
												sx={{
													maxWidth: { xs: 350, md: 300 },
												}}
											/>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

Row.propTypes = {
	row: PropTypes.shape({
		matching: PropTypes.bool.isRequired,
		newData: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			title: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			subtitle: PropTypes.string,
			category: PropTypes.string,
			synopsis: PropTypes.string,
		}),

		productionData: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			series_name: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			synopsis: PropTypes.string.isRequired,
			series_id: PropTypes.string.isRequired,
			product_id: PropTypes.string.isRequired,
		}),
	}).isRequired,
};

// const rows = [createData(), createData()];

export default function CollapsibleTable() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [rows, setRows] = useState([]);
	const { loading, setLoading } = useState([true]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const fetchData = () => {
		const getNew = axios.get(`${API_ENDPOINT}/data/new`);
		const getProduction = axios.get(`${API_ENDPOINT}/data/production`);
		axios.all([getNew, getProduction]).then(
			axios.spread((...allData) => {
				const allNewData = allData[0].data;
				const allProductionData = allData[1].data;
				const matchingNewData = allNewData.filter((itemNew) =>
					allProductionData.some(
						(itemProduction) => itemProduction["name"] === itemNew["title"]
					)
				);
				const matchingProductionData = matchingNewData.map((item) =>
					allProductionData.find((obj) => obj["name"] === item["title"])
				);

				const matchingRows = matchingNewData.map(function (newDat, i) {
					return {
						matching: true,
						newData: newDat,
						productionData: matchingProductionData[i],
					};
				});
				console.log(matchingRows);
				setRows(matchingRows);
				setLoading(true);
			})
		);
	};

	// This method fetches the records from the database.
	useEffect(() => {
		fetchData();
		return;
	}, []);

	return (
		<TableContainer component={Paper} sx={{ maxHeight: "85vh" }}>
			<Table stickyHeader aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>
							<Typography
								component="h1"
								variant="h5"
								color="inherit"
								noWrap
								sx={{ flexGrow: 0.7 }}
							>
								Title
							</Typography>
						</TableCell>
						<TableCell align="right" width="50">
							<Typography
								component="h1"
								variant="h6"
								color="inherit"
								noWrap
								sx={{ flexGrow: 0.7 }}
							>
								Matches
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{/* {rows.map((row) => (
						<Row row={row} />
					))} */}
					{rows
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row) => {
							return <Row row={row} />;
						})}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[10, 25]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</TableContainer>
	);
}
