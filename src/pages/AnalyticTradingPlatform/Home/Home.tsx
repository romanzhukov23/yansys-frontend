import {Submit, TextField, Table} from "../../../shared/ui";
import {SetStateAction, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {Row, Filters, SearchFilters, Column as ColumnType} from "../../../shared/types";
import {SortForm} from "../../../shared/ui/forms/SortForm";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column"
import {Card} from "primereact/card";
import {useNavigate} from "react-router-dom";

export function Home() {
	const navigate = useNavigate();
	const [, setActive] = useState<Row>({
		ema: "",
		id: "",
		instrument: "",
		macd: "",
		price: "",
		signalMacd: "",
		// rsi: "",
	})

	const [filters, setFilters] = useState<Filters[]>([]);
	const [searchFilters, setSearchFilters] = useState<SearchFilters[]>([]);
	const [initRows, setInitRows] = useState<Row[]>([]);
	const [rows, setRows] = useState<Row[]>([]);
	const [instrument, setInstrument] = useState('');

	const [indicatorsLoading, setIndicatorsLoading] = useState(false);

	const [columns] = useState<ColumnType[]>([
		{name: 'id', title: '№', width: 'w-[3vw]'},
		{name: 'instrument', title: 'Акция', width: 'w-[6vw]'},
		{name: 'price', title: 'Цена', width: 'w-[8vw]'},
		{name: 'ema', title: 'EMA', width: 'w-[8vw]'},
		{name: 'macd', title: 'MACD', width: 'w-[8vw]'},
		{name: 'signalMacd', title: 'sgl MACD', width: 'w-[8vw]'},
		// {name: 'rsi', title: 'RSI', width: 'w-[8vw]'},
	]);

	useEffect(() => {
		const fetchIndicators = async () => {
			setIndicatorsLoading(true);

			// const importQuotesQuery = {
			// 	"query": `mutation {importQuotes }`
			// };
			//
			// const quotes = await axios.post(GRAPHQL_URL, importQuotesQuery).then(q => q.data.data.importQuotesQuery);
			//
			// console.log(quotes);

			const indicators: {
				AllArray: any;
				ticker: string;
			}[] = []

			const getIndicatorsQuery = {
				"query": `query { getIndicators { ticker AllArray { price time ema macd signalMacd } period } }`
			}

			axios.post(GRAPHQL_URL, getIndicatorsQuery).then(
				r => {
					indicators.push(...r.data.data.getIndicators);
					setInitRows(indicators.map((indicator, index) => ({
						id: (index + 1).toString(),
						instrument: indicator.ticker,
						price: indicator.AllArray[indicator.AllArray.length - 1].price.toFixed(2).toString(),
						ema: indicator.AllArray[indicator.AllArray.length - 1].ema.toFixed(2).toString(),
						macd: indicator.AllArray[indicator.AllArray.length - 1].macd.toFixed(2).toString(),
						signalMacd: indicator.AllArray[indicator.AllArray.length - 1].signalMacd.toFixed(2).toString(),
						// rsi: '122',
					})));
					setRows(indicators.map((indicator, index) => ({
						id: (index + 1).toString(),
						instrument: indicator.ticker,
						price: indicator.AllArray[indicator.AllArray.length - 1].price.toFixed(2).toString(),
						ema: indicator.AllArray[indicator.AllArray.length - 1].ema.toFixed(2).toString(),
						macd: indicator.AllArray[indicator.AllArray.length - 1].macd.toFixed(2).toString(),
						signalMacd: indicator.AllArray[indicator.AllArray.length - 1].signalMacd.toFixed(2).toString(),
						// rsi: '122',
					})));

					setActive({
						id: '1',
						instrument: indicators[0].ticker,
						price: indicators[0].AllArray[indicators[0].AllArray.length - 1].price.toFixed(2).toString(),
						ema: indicators[0].AllArray[indicators[0].AllArray.length - 1].ema.toFixed(2).toString(),
						macd: indicators[0].AllArray[indicators[0].AllArray.length - 1].macd.toFixed(2).toString(),
						signalMacd: indicators[0].AllArray[indicators[0].AllArray.length - 1].signalMacd.toFixed(2).toString(),
						// rsi: "122",
					})

					let tempFilters: { title: string, min: string, max: string }[] = [];

					const ema = indicators.map(i => parseFloat(i.AllArray[i.AllArray.length - 1].ema))
					const prices = indicators.map(i => parseFloat(i.AllArray[i.AllArray.length - 1].price))
					const macd = indicators.map(i => parseFloat(i.AllArray[i.AllArray.length - 1].macd))
					const signalMacd = indicators.map(i => parseFloat(i.AllArray[i.AllArray.length - 1].signalMacd))

					tempFilters.push({title: "Цена", min: Math.min(...prices).toString(), max: Math.max(...prices).toString()});
					tempFilters.push({title: "EMA", min: Math.min(...ema).toString(), max: Math.max(...ema).toString()});
					tempFilters.push({title: "MACD", min: Math.min(...macd).toString(), max: Math.max(...macd).toString()});
					tempFilters.push({
						title: "sgl MACD",
						min: Math.min(...signalMacd).toString(),
						max: Math.max(...signalMacd).toString()
					});

					setFilters(tempFilters)
					setSearchFilters(tempFilters.map(f => (
						{min: f.min, max: f.max}
					)))
				}
			);

			setIndicatorsLoading(false);
		}

		fetchIndicators();
	}, []);

	const setSF = (newstr: string, i: number, type: 'min' | 'max'): void => {
		let tempFilters: { min: string, max: string }[] = []
		for (let j = 0; j < searchFilters.length; j++) {
			if (j !== i) {
				tempFilters[j] = searchFilters[j];
			} else {
				tempFilters[j] = type === 'min' ? {min: newstr, max: searchFilters[j].max} : {
					max: newstr,
					min: searchFilters[j].min
				};
			}
		}
		setSearchFilters(tempFilters);
	}

	const handleSubmitClick = (): void => {
		console.log(instrument.toUpperCase())
		const search = instrument.toUpperCase()
		const newRows = []
		for (const row of initRows) {
			// &&
			// 	parseFloat(row.rsi) >= parseFloat(searchFilters[1].min) &&
			// 	parseFloat(row.rsi) <= parseFloat(searchFilters[1].max) &&
			// 	parseFloat(row.macd) >= parseFloat(searchFilters[3].min) &&
			// 	parseFloat(row.macd) <= parseFloat(searchFilters[3].max)
			if (
				parseFloat(row.price) >= parseFloat(searchFilters[0].min) &&
				parseFloat(row.price) <= parseFloat(searchFilters[0].max) &&
				parseFloat(row.ema) >= parseFloat(searchFilters[1].min) &&
				parseFloat(row.ema) <= parseFloat(searchFilters[1].max) &&
				parseFloat(row.macd) >= parseFloat(searchFilters[2].min) &&
				parseFloat(row.macd) <= parseFloat(searchFilters[2].max) &&
				parseFloat(row.signalMacd) >= parseFloat(searchFilters[3].min) &&
				parseFloat(row.signalMacd) <= parseFloat(searchFilters[3].max) &&
				row.instrument.includes(search)) {
				console.log(row.price >= searchFilters[0].min, row.price <= searchFilters[0].max)
				newRows.push(row)
			}
		}
		setRows(newRows)
		console.log(rows)
	}

	// const filteredRows = useMemo(
	// 	() => {
	// 		if ()
	// 	},[searchFilters]
	// )

	return <div className='mx-8 mt-3 flex justify-content-center gap-4'>
		<Card className='max-h-50rem min-w-50rem'>
			{indicatorsLoading
			?
				'Загрузка...'
			:
				<DataTable
					value={rows}
					scrollable
					scrollHeight='48rem'
					style={{ minWidth: '60rem' }}
					onRowClick={(event) => navigate('/')}
				>
					{columns.map((col, i) =>
						<Column field={col.name} header={col.title} key={i} />
					)}
				</DataTable>
			}
		</Card>

			<SortForm indicatorsLoading={indicatorsLoading} instrument={instrument} setInstrument={setInstrument} filters={filters} searchFilters={searchFilters} setSF={setSF}/>
	</div>
}

// <Table className='text-2xl w-[60vw] bg-gray-200 p-4 rounded-xl shadow-2xl' columns={columns} data={rows}
// 	   selectActive={(activeTicker: SetStateAction<Row>) => setActive(activeTicker)}/>





//
//
// import {Component} from "react";
// import {Simulate} from "react-dom/test-utils";
// import axios from "axios";
// import {GRAPHQL_URL} from "../URL";
// import {ActiveTicker, TickerList} from "../../shared/ui/lists";
//
// export class Home extends Component {
// 	// @ts-ignore
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			data: null,
// 			term: '',
// 			active: 0,
// 		}
//
// 		this.loadData();
// 	}
//
// 	loadData() {
// 		new Promise((resolve, reject) => {
// 			const getIndicatorsQuery = {
// 				"query": `query { getIndicators { ticker priceArray { time value } emaArray { time value } period } }`
// 			}
//
// 			axios.post(GRAPHQL_URL, getIndicatorsQuery).then(r => resolve(r))
//
// 		}).then(data => {
// 			// @ts-ignore
// 			console.log(data.data.data.getIndicators)
// 			// @ts-ignore
// 			this.setState({data: data.data.data.getIndicators.map(t => ({
// 				instrument: t.instrument,
// 				price: t.priceArray[-1],
// 				ema: t.emaArray[-1],
// 				})
// 			)});
// 		})
// 	}
//
// 	// @ts-ignore
// 	updateData(config) {
// 		this.setState(config);
// 	}
//
// 	render() {
// 		return (
// 			<div className="app container-fluid">
// 				<div className="row">
// 					<div className="col-sm-4 col-md-3 col-lg-2">
// 						{/*@ts-ignore*/}
// 						<ActiveTicker data={this.state.data} active={this.state.active}/>
// 					</div>
// 					<div className="col-sm-8 col-md-9 col-lg-10">
// 						{/*@ts-ignore*/}
// 						<TickerList data={this.state.data} update={this.updateData.bind(this)} />
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// }