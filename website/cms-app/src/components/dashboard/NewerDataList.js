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
import Link from "@mui/material/Link";

import Title from "./Title";
import axios from "axios";
import { useState, useEffect } from "react";

var stringSimilarity = require("string-similarity");

function getStringSimilarity(s1, s2) {
	return stringSimilarity.compareTwoStrings(s1 || "", s2 || "");
}
function round3dp(num) {
	return Math.round(num * 1000) / 10;
}

const API_ENDPOINT = "http://localhost:5000";

function manipulateImageURL(link) {
	const url = new URL(link);
	url.searchParams.set("p", "100");
	return url.href;
}

function EpisodeRow(props) {
	const { newEpisode, oldEpisode } = props;
	return (
		<React.Fragment>
			<TableRow>
				<TableCell>{newEpisode.source}</TableCell>

				<TableCell>{newEpisode._id}</TableCell>
				<TableCell style={{ whiteSpace: "nowrap" }}>
					<Link href={newEpisode.url}>
						{"Ep. "}
						{newEpisode.episode_number}
					</Link>
					{"  "}
					{newEpisode.episode_name}
				</TableCell>
				<TableCell>{newEpisode.episode_details}</TableCell>
				<TableCell>
					<Image
						src={newEpisode.cover_img_url}
						duration={1500}
						width={350}
						sx={{
							maxWidth: { xs: 350, md: 300 },
						}}
					/>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell>{oldEpisode.source}</TableCell>
				<TableCell>{oldEpisode._id}</TableCell>
				<TableCell style={{ whiteSpace: "nowrap" }}>
					<Link href={oldEpisode.url}>
						{"Ep. "}
						{oldEpisode.episode_number}
					</Link>
					{oldEpisode.episode_name}
				</TableCell>
				<TableCell>{oldEpisode.episode_details}</TableCell>

				<TableCell>
					<Image
						src={oldEpisode.cover_img_url}
						duration={1500}
						width={350}
						sx={{
							maxWidth: { xs: 350, md: 300 },
						}}
					/>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

EpisodeRow.propTypes = {
	newEpisode: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		series_id: PropTypes.string.isRequired,
		episode_name: PropTypes.string,
		episode_details: PropTypes.string,
		url: PropTypes.string,
		cover_img_url: PropTypes.string,
		source: PropTypes.string,
	}),
	oldEpisode: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		series_id: PropTypes.string.isRequired,
		episode_name: PropTypes.string,
		episode_details: PropTypes.string,
		url: PropTypes.string,
		cover_img_url: PropTypes.string,
		source: PropTypes.string,
	}),
};

function EpisodesTable(props) {
	const { row } = props;
	const [data, setData] = useState([]);

	function compare_epi_num(a, b) {
		if (a.episode_number < b.episode_number) {
			return -1;
		}
		if (a.episode_number > b.episode_number) {
			return 1;
		}
		return 0;
	}

	const fetchData = () => {
		const getNew = axios.get(
			`${API_ENDPOINT}/data/new/${row.newDat._id}/episodes`
		);
		const getOld = axios.get(
			`${API_ENDPOINT}/data/old/${row.oldDat._id}/episodes`
		);
		axios.all([getNew, getOld]).then(
			axios.spread((...allData) => {
				const allNewData = allData[0].data;
				const allOldData = allData[1].data;

				allNewData.sort(compare_epi_num);

				const matchingNewData = allNewData.filter((itemNew) =>
					allOldData.some(
						(itemOld) => itemOld["episode_number"] === itemNew["episode_number"]
					)
				);
				const matchingOldData = matchingNewData.map((item) =>
					allOldData.find(
						(obj) => obj["episode_number"] === item["episode_number"]
					)
				);

				const matchingData = matchingNewData.map(function (newDat, i) {
					newDat.source = "New";
					matchingOldData[i].source = "Old";
					return { newDat: newDat, oldDat: matchingOldData[i] };
				});
				console.log(matchingData);
				setData(matchingData);
			})
		);
	};

	// This method fetches the records from the database.
	useEffect(() => {
		fetchData();
		return;
	}, []);

	return (
		<React.Fragment>
			<Box
				sx={{ margin: 1, padding: 1, borderRadius: 3 }}
				style={{ background: "#C3EAC4" }}
			>
				<Table
					size="small"
					aria-label="caption"
					style={{ width: "auto", tableLayout: "auto" }}
				>
					{/* <caption>New website: series ID is generated</caption> */}
					<TableHead>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>
								<Typography style={{ whiteSpace: "nowrap" }}>
									Product ID
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>Episode</Typography>
							</TableCell>
							<TableCell>
								<Typography>Details</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography>Image</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((dat, i) => {
							return (
								<EpisodeRow
									newEpisode={dat.newDat}
									oldEpisode={dat.oldDat}
									key={i}
								></EpisodeRow>
							);
						})}
					</TableBody>
				</Table>
			</Box>
		</React.Fragment>
	);
}
EpisodesTable.propTypes = {
	row: PropTypes.shape({
		newDat: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			series_name: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			summary: PropTypes.string,
			source: PropTypes.string.isRequired,
		}),
		oldDat: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			series_name: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			summary: PropTypes.string,
			source: PropTypes.string.isRequired,
		}),
	}).isRequired,
};

function InnerRow(props) {
	const { series } = props;
	return (
		<React.Fragment>
			<TableRow>
				<TableCell>{series.source}</TableCell>
				<TableCell style={{ whiteSpace: "nowrap" }}>
					<Link href={series.url}>{series.series_name}</Link>
					{" | "}
					{series._id}
				</TableCell>
				<TableCell>{series.category_name}</TableCell>
				<TableCell>{series.summary}</TableCell>
				{/* <TableCell>{series.summary}</TableCell> */}
				<TableCell>
					<Image
						src={series.image_url}
						duration={1500}
						width={350}
						sx={{
							maxWidth: { xs: 350, md: 300 },
						}}
					/>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

InnerRow.propTypes = {
	series: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		series_name: PropTypes.string.isRequired,
		category_name: PropTypes.string.isRequired,
		image_url: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		summary: PropTypes.string,
		source: PropTypes.string.isRequired,
	}).isRequired,
};

function Row(props) {
	const { row } = props;
	const [rows, setRows] = useState([]);
	const [open, setOpen] = useState(false);

	// var synopsisMatch = getStringSimilarity(
	// 	row.newData.synopsis,
	// 	row.productionData.synopsis
	// );
	// var categoryMatch = getStringSimilarity(
	// 	row.newData.subtitle,
	// 	row.productionData.category_name
	// );
	// var overallSimilarity = round3dp((synopsisMatch + categoryMatch) / 2);
	// synopsisMatch = round3dp(synopsisMatch);
	// categoryMatch = round3dp(categoryMatch);

	// function getChipColor(similarity) {
	// 	return similarity === 100
	// 		? "success"
	// 		: similarity > 75
	// 		? "warning"
	// 		: "error";
	// }

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
						{row.newDat.series_name}
					</Typography>
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
								<caption>New website: series ID is generated</caption>
								<TableHead>
									<TableRow>
										<TableCell></TableCell>
										<TableCell>
											<Typography>Series | ID</Typography>
										</TableCell>
										<TableCell>
											<Typography>Category</Typography>
										</TableCell>
										<TableCell>
											<Typography>Synopsis</Typography>
										</TableCell>
										<TableCell align="center">
											<Typography>Image</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<InnerRow series={row.newDat} />
									<InnerRow series={row.oldDat} />
								</TableBody>
							</Table>
							<EpisodesTable row={row}></EpisodesTable>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

Row.propTypes = {
	row: PropTypes.shape({
		newDat: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			series_name: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			summary: PropTypes.string,
			source: PropTypes.string.isRequired,
		}),
		oldDat: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			series_name: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			summary: PropTypes.string,
			source: PropTypes.string.isRequired,
		}),
	}).isRequired,
};

export default function NewerTable() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [rows, setRows] = useState([]);
	const { loading, setLoading } = useState(true);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const fetchData = () => {
		const getNew = axios.get(`${API_ENDPOINT}/data/new/series`);
		const getOld = axios.get(`${API_ENDPOINT}/data/old/series`);
		axios.all([getNew, getOld]).then(
			axios.spread((...allData) => {
				const allNewData = allData[0].data;
				const allOldData = allData[1].data;
				console.log(allNewData);
				console.log(allOldData);
				const matchingNewData = allNewData.filter((itemNew) =>
					allOldData.some(
						(itemOld) => itemOld["series_name"] === itemNew["series_name"]
					)
				);
				const matchingOldData = matchingNewData.map((item) =>
					allOldData.find((obj) => obj["series_name"] === item["series_name"])
				);

				// const matchingRows = matchingNewData.map(function (newDat, i) {
				// 	matchingProductionData[i].source = "Viu";
				// 	newDat.source = "QA New";
				// 	return [matchingProductionData[i], newDat];
				// });
				const matchingRows = matchingNewData.map(function (newDat, i) {
					matchingOldData[i].source = "Old";
					newDat.source = "New";
					return { newDat: newDat, oldDat: matchingOldData[i] };
				});
				console.log(matchingRows);
				setRows(matchingRows);
				setLoading(false);
			})
		);
	};

	// This method fetches the records from the database.
	useEffect(() => {
		fetchData();
		return;
	}, []);

	return (
		<Box>
			<Title>Series</Title>
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
							.map((row, i) => {
								return <Row row={row} key={i} />;
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
		</Box>
	);
}
