import { useState, useEffect } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Image } from "mui-image";

// const rows = [
// 	{
// 		_id: "62da15eb7468151f7b791204",
// 		name: "為何是吳秀才？",
// 		category_name: "韓劇",
// 		series_name: "為何是吳秀才？",
// 		product_id: "438417",
// 		series_id: "23583",
// 		synopsis: "新任代表",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/2359099421/eb5d2dfa57602431bc949ad4c32c784bc95348f8",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b791205",
// 		name: "魔咒的戀人",
// 		category_name: "韓劇",
// 		series_name: "魔咒的戀人",
// 		product_id: "440728",
// 		series_id: "23701",
// 		synopsis: "預言女巫",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/1916552727/ed15179c715a8eb25696fb6430082e970e95a2f3",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b791206",
// 		name: "海賊王",
// 		category_name: "日本動畫",
// 		series_name: "海賊王",
// 		product_id: "186029",
// 		series_id: "6781",
// 		synopsis: "特別篇！最強賞金獵人席德爾",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/1993048887/953681220d24a04366c7230e4dfffa666dcbaced",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b791207",
// 		name: "男兒當入樽 (粵語版)",
// 		category_name: "日本動畫",
// 		series_name: "男兒當入樽 (粵語版)",
// 		product_id: "126198",
// 		series_id: "7619",
// 		synopsis: "天才籃球員誕生",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/2062125381/f8b720d2ae47fb4c4cce70c3a443515d5065f2e9",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b791208",
// 		name: "《流星》預告",
// 		category_name: "預告及製作花絮",
// 		series_name: "《流星》預告",
// 		product_id: "432499",
// 		series_id: "22945",
// 		synopsis: "明星經理人日常",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/3663589405/86dc50040a2a8fa607c0ca339dbf85c74b1c9af7",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b791209",
// 		name: "K1韓娛新聞 2022",
// 		category_name: "娛樂新聞",
// 		series_name: "K1韓娛新聞 2022",
// 		product_id: "417437",
// 		series_id: "21652",
// 		synopsis: "【2022元旦情侶】亞運會得分王黃義助Long D三個月 事業愛情兼得",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/1052856718/53da75214dc1bbf441debda31a469cc60789800c",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b79120a",
// 		name: "龍珠超 (粵語版)",
// 		category_name: "日本動畫",
// 		series_name: "龍珠超 (粵語版)",
// 		product_id: "363842",
// 		series_id: "19258",
// 		synopsis: "和平的報酬 一億索尼獎金花落誰家",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/1193333981/5f320beb531e098aa34e08c3208f52aabd75cece",
// 	},
// 	{
// 		_id: "62da15eb7468151f7b79120b",
// 		name: "Miracle",
// 		category_name: "韓劇",
// 		series_name: "Miracle",
// 		product_id: "441919",
// 		series_id: "23817",
// 		synopsis: "萬人迷",
// 		image_url:
// 			"https://www.viu.com/ott/hk/v1/imgprocess/reduceImage.php?p=30&img=https://d2anahhhmp1ffz.cloudfront.net/1855764031/aef5237d714a73c4459fdce0b875e18d71621b62",
// 	},
// ];

// Change image url parameter to enhance quality
function manipulateURL(link) {
	const url = new URL(link);
	url.searchParams.set("p", "100");
	return url.href;
}

const columns = [
	// { field: "_id", headerName: "ID", width: 100 },
	{ field: "name", headerName: "Name", minWidth: 150, flex: 0.9 },
	{ field: "category_name", headerName: "Category", minWidth: 150, flex: 0.9 },
	{ field: "synopsis", headerName: "Synopsis", minWidth: 200, flex: 1 },
	{
		field: "product_id",
		headerName: "Product ID",
		type: "number",
		minWidth: 100,
		flex: 0.5,
	},
	{
		field: "series_id",
		headerName: "Series ID",
		type: "number",
		minWidth: 100,
		flex: 0.5,
	},
	{
		field: "image_url",
		headerName: "Image",
		minWidth: 200,
		flex: 1,
		renderCell: (params) => {
			// return <img src={params.value} />;
			return <Image src={manipulateURL(params.value)} />;
		},
	},
];

export default function ListView() {
	const [data, setData] = useState([]);

	// This method fetches the records from the database.
	useEffect(() => {
		async function getData() {
			const response = await fetch(`http://localhost:5000/data/production`);

			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}

			const records = await response.json();
			setData(records);
		}

		getData();

		return;
	}, [data.length]);

	return (
		<Box sx={{ height: "85vh", width: "100%" }}>
			<DataGrid
				rows={data}
				columns={columns}
				getRowId={(row) => row._id}
				getRowHeight={() => "auto"}
				getEstimatedRowHeight={() => 200}
				disableSelectionOnClick
				sx={{ fontSize: "1em" }}
			/>
		</Box>
	);
}
