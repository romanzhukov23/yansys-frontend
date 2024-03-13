import {Table} from "../../../shared/ui/tables";
import {Submit, TextField} from "../../../shared/ui";
import {SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../URL";

type Row = {
	id: string;
	instrument: string;
	price: string;
	ema: string;
	macd: string;
	signalMacd: string;
	// rsi: string;
}

type Filters = {
	title: string;
	min: string;
	max: string;
}

type SearchFilters = {
	min: string;
	max: string;
}

type Column = {
	name: "id" | "instrument" | "price" | "ema" | "macd" | "signalMacd"; //| "rsi";
	title: string;
	width: string;
}

export function Main() {
	const [activeTicker, setActive] = useState<Row>({
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

	const [columns] = useState<Column[]>([
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

	return <div className='m-[2vw] flex gap-4'>
		{indicatorsLoading ? <div
				className='text-xl flex justify-center items-center w-[19vw] bg-gray-200 p-4 rounded-xl shadow-2xl'>Загрузка...</div> :
			<div className='text-xl flex flex-col w-[19vw] bg-gray-200 p-4 rounded-xl shadow-2xl'>
				<div className='self-center text-4xl'>{activeTicker.instrument.toString()}</div>
				<div className='flex'>
					<div className='pt-1 self-start '>Цена:</div>
					<div className='pt-1 self-start ml-auto'>{activeTicker.price.toString()}</div>
				</div>
				<div className='flex'>
					<div className='pt-1 self-start '>EMA:</div>
					<div className='pt-1 self-start ml-auto'>{activeTicker.ema.toString()}</div>
				</div>
				<div className='flex'>
					<div className='pt-1 self-start '>От линии тренда на:</div>
					<div
						className='pt-1 self-start ml-auto'>{(parseFloat(activeTicker.price) * 100 / parseFloat(activeTicker.ema) - 100).toFixed(2)}%
					</div>
				</div>
				<div className='flex'>
					<div className='pt-1 self-start '>MACD:</div>
					<div className='pt-1 self-start ml-auto'>{activeTicker.macd.toString()}</div>
				</div>
				<div className='flex'>
					<div className='pt-1 self-start '>sgl MACD:</div>
					<div className='pt-1 self-start ml-auto'>{activeTicker.signalMacd.toString()}</div>
				</div>
				<div className='flex flex-row justify-center items-center content-center'>
					<div className='flex pt-1 self-start '>Разница MACD и сигнальной MACD:</div>
					<div className='flex pt-1 ml-auto justify-center content-center items-center'>{(parseFloat(activeTicker.macd) - parseFloat(activeTicker.signalMacd)).toFixed(2).toString()}</div>
				</div>
				{/*<div className='flex'>*/}
				{/*	<div className='pt-1 self-start '>RSI:</div>*/}
				{/*	<div className='pt-1 self-start ml-auto'>{activeTicker.rsi.toString()}</div>*/}
				{/*</div>*/}
			</div>}

		{indicatorsLoading ? <div
				className='flex justify-center items-center text-2xl w-[60vw] bg-gray-200 p-4 rounded-xl shadow-2xl'>Загрузка...</div> :
			<Table className='text-2xl w-[60vw] bg-gray-200 p-4 rounded-xl shadow-2xl' columns={columns} data={rows}
			       selectActive={(activeTicker: SetStateAction<Row>) => setActive(activeTicker)}/>}

		<div className='flex gap-[2vh] w-[19vw] flex-col bg-gray-200 p-3 rounded-xl shadow-2xl'>
			<h1 className='text-xl'>Поиск по инструменту</h1>
			<TextField className='p-2' text='2xl' height='[5vh]' width='[12vw]'
			           onChange={(evt): void => setInstrument(evt.target.value)} value={instrument}/>

			<h1 className='text-xl'>Поиск по фильтрам</h1>
			{indicatorsLoading ? <div>Загрузка...</div> : <div>
				{filters.map((f, index) => <div className='py-3 flex items-center gap-2'>
					<p className='text-lg w-[2vw] mr-0.5'>{f.title}</p>
					<div className='flex gap-2 ml-auto items-center'>
						<TextField className='p-1' text='base' width='[6vw]' onChange={(evt): void => {
							setSF(evt.target.value, index, 'min');
							console.log(evt.target.value)
						}}
						           placeholder={f.min !== null ? f.min : '0'}
						           value={parseFloat(searchFilters[index].min).toFixed(2).toString()}/>
						<p className='text-base'>—</p>
						<TextField className='p-1' text='base' width='[6vw]' onChange={(evt): void => {
							setSF(evt.target.value, index, 'max');
							console.log(evt.target.value)
						}}
						           placeholder={f.max} value={parseFloat(searchFilters[index].max).toFixed(2).toString()}/>
					</div>

				</div>)}
			</div>}

			<Submit color='bg-[#06b6d4]' className='rounded-lg h-[4vh] w-[7vw] bg-gray-400' onClick={handleSubmitClick} label='ПОИСК'/>
		</div>
	</div>
}


//
//
// import {Component} from "react";
// import {Simulate} from "react-dom/test-utils";
// import axios from "axios";
// import {GRAPHQL_URL} from "../URL";
// import {ActiveTicker, TickerList} from "../../shared/ui/lists";
//
// export class Main extends Component {
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