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
import { renderMatches } from "react-router-dom";

var stringSimilarity = require("string-similarity");

function getStringSimilarity(s1, s2) {
	return stringSimilarity.compareTwoStrings(s1 || "", s2 || "");
}
function round3dp(num) {
	if (num === -1) {
		return -1;
	}
	return Math.round(num * 1000) / 10;
}

const API_ENDPOINT = "http://localhost:5000";

function InnerRow(props) {
	const { movie } = props;
	return (
		<React.Fragment>
			<TableRow>
				<TableCell>{movie.source}</TableCell>
				<TableCell style={{ whiteSpace: "nowrap" }}>
					<Link href={movie.url}>{movie.product_name}</Link>
					{" | "}
					{movie.product_id}
				</TableCell>
				<TableCell>{movie.category_name}</TableCell>
				<TableCell>{movie.synopsis}</TableCell>
				<TableCell>{movie.summary}</TableCell>
				<TableCell>
					<Image
						src={movie.image_url}
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
	movie: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		product_id: PropTypes.string.isRequired,
		category_name: PropTypes.string.isRequired,
		image_url: PropTypes.string.isRequired,
		url: PropTypes.string.isRequired,
		synopsis: PropTypes.string,
		summary: PropTypes.string,
		source: PropTypes.string,
	}).isRequired,
};

function Row(props) {
	const { row } = props;
	const [open, setOpen] = useState(false);

	if (
		row.newDat.synopsis === undefined ||
		row.oldDat.synopsis === undefined ||
		row.newDat.synopsis === null ||
		row.oldDat.synopsis === null
	) {
		var synopsisMatch = -1;
	} else {
		var synopsisMatch = getStringSimilarity(
			row.newDat.synopsis,
			row.oldDat.synopsis
		);
	}

	if (
		row.newDat.summary === undefined ||
		row.oldDat.summary === undefined ||
		row.newDat.summary === null ||
		row.oldDat.summary === null
	) {
		var summaryMatch = -1;
	} else {
		var summaryMatch = getStringSimilarity(
			row.newDat.summary,
			row.oldDat.summary
		);
	}
	// var categoryMatch = getStringSimilarity(
	// 	row.newData.subtitle,
	// 	row.productionData.category_name
	// );
	// var overallSimilarity = round3dp((synopsisMatch + categoryMatch) / 2);
	synopsisMatch = round3dp(synopsisMatch);
	summaryMatch = round3dp(summaryMatch);

	let synopsisChip, summaryChip;
	if (synopsisMatch === -1) {
		synopsisChip = <Chip label={"Insufficient Data"} />;
	} else {
		synopsisChip = (
			<Chip label={synopsisMatch + "%"} color={getChipColor(synopsisMatch)} />
		);
	}
	if (summaryMatch === -1) {
		summaryChip = <Chip label={"Insufficient Data"} />;
	} else {
		summaryChip = (
			<Chip label={summaryMatch + "%"} color={getChipColor(summaryMatch)} />
		);
	}
	function getChipColor(similarity) {
		return similarity === 100
			? "success"
			: similarity > 75
			? "warning"
			: similarity === -1
			? "secondary"
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
						{row.newDat.product_name}
					</Typography>
				</TableCell>
				{/* <TableCell component="th" scope="row">
					<Chip label={summaryMatch + "%"} color={getChipColor(summaryMatch)} />
				</TableCell> */}
				<TableCell></TableCell>
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
											<Typography>Title | Product ID</Typography>
										</TableCell>
										<TableCell>
											<Typography>Category</Typography>
										</TableCell>
										<TableCell>
											<Typography>Synopsis</Typography>
											{synopsisChip}
										</TableCell>
										<TableCell>
											<Typography>Summary</Typography>
											{summaryChip}
										</TableCell>
										<TableCell>
											<Typography>Image</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<InnerRow movie={row.newDat} />
									<InnerRow movie={row.oldDat} />
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
		newDat: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			product_id: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			synopsis: PropTypes.string,
			summary: PropTypes.string,
		}),
		oldDat: PropTypes.shape({
			_id: PropTypes.string.isRequired,
			product_id: PropTypes.string.isRequired,
			category_name: PropTypes.string.isRequired,
			image_url: PropTypes.string.isRequired,
			url: PropTypes.string.isRequired,
			synopsis: PropTypes.string,
			summary: PropTypes.string,
		}),
	}).isRequired,
};

export default function MovieTable() {
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
		const getNew = axios.get(`${API_ENDPOINT}/data/new/movies`);
		const getOld = axios.get(`${API_ENDPOINT}/data/old/movies`);
		axios.all([getNew, getOld]).then(
			axios.spread((...allData) => {
				const allNewData = allData[0].data;
				const allOldData = allData[1].data;
				console.log(allNewData);
				console.log(allOldData);
				const matchingNewData = allNewData.filter((itemNew) =>
					allOldData.some(
						(itemOld) => itemOld["product_name"] === itemNew["product_name"]
					)
				);
				const matchingOldData = matchingNewData.map((item) =>
					allOldData.find((obj) => obj["product_name"] === item["product_name"])
				);

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
			<Title>Movies</Title>
			<TableContainer component={Paper} sx={{ height: "85vh" }}>
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
