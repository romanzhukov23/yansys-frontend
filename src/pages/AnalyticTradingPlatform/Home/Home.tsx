import React, {useEffect, useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {Row, Column as ColumnType} from "../../../shared/types";
import {DataTable, DataTableFilterMeta} from "primereact/datatable";
import {Column} from "primereact/column"
import {Card} from "primereact/card";
import {useNavigate} from "react-router-dom";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {FilterMatchMode} from "primereact/api";
import {Slider, SliderChangeEvent} from "primereact/slider";

export function Home() {
	const navigate = useNavigate();

	const [filters, setFilters] = useState<DataTableFilterMeta>({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		instrument: { value: null, matchMode: FilterMatchMode.CONTAINS },
		price: { value: null, matchMode: FilterMatchMode.BETWEEN },
		ema: { value: null, matchMode: FilterMatchMode.BETWEEN },
		macd: { value: null, matchMode: FilterMatchMode.BETWEEN },
		signalMacd: { value: null, matchMode: FilterMatchMode.BETWEEN },
	});

	const [rows, setRows] = useState<Row[]>([]);
	const [priceFilter, setPriceFilter] = useState<[number, number]>();
	const [emaFilter, setEmaFilter] = useState<[number, number]>();
	const [macdFilter, setMacdFilter] = useState<[number, number]>();
	const [signalMacdFilter, setSignalMacdFilter] = useState<[number, number]>();
	const [bounds, setBounds] = useState<{min: number, max: number}[]>();
	const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

	const fixFormat = (value: number) => {
		return value.toFixed(2).toString();
	}

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

			const indicators: {
				price: {close: number, time: Date}
				ema: {value: number, time: Date};
				macd: {value: number, time: Date};
				signal_macd: {value: number, time: Date};
				ticker: string;
			}[] = []

			const getIndicatorsQuery = {
				"query": `query { getLastIndicators { ticker price { close time } ema { value time } macd { value time } signal_macd { value time } } }`
			}

			axios.post(GRAPHQL_URL, getIndicatorsQuery).then(
				r => {
					indicators.push(...r.data.data.getLastIndicators);
					setRows(indicators.map((indicator, index) => ({
						id: (index + 1).toString(),
						instrument: indicator.ticker,
						price: fixFormat(indicator.price.close),
						ema: fixFormat(indicator.ema.value),
						macd: fixFormat(indicator.macd.value),
						signalMacd: fixFormat(indicator.signal_macd.value),
						// rsi: '122',
					})));
					let prices: number[] = [];
					let emas: number[] = [];
					let macds: number[] = [];
					let signalMacds: number[] = [];
					indicators.map(indicator => {
						prices.push(indicator.price.close);
						emas.push(indicator.ema.value);
						macds.push(indicator.macd.value);
						signalMacds.push(indicator.signal_macd.value);
					});

					setPriceFilter([Math.min(...prices), Math.max(...prices)]);
					setEmaFilter([Math.min(...emas), Math.max(...emas)]);
					setMacdFilter([Math.min(...macds), Math.max(...macds)]);
					setSignalMacdFilter([Math.min(...signalMacds), Math.max(...signalMacds)])
					setBounds([
						{min: Math.min(...prices), max: Math.max(...prices)},
						{min: Math.min(...emas), max: Math.max(...emas)},
						{min: Math.min(...macds), max: Math.max(...macds)},
						{min: Math.min(...signalMacds), max: Math.max(...signalMacds)},
					]);

					setIndicatorsLoading(false);
				}
			);
		}

		fetchIndicators();
	}, []);

	const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		let _filters = { ...filters };
		// @ts-ignore
		_filters['instrument'].value = value;
		setFilters(_filters);
		setGlobalFilterValue(value);
	};
	const onPriceFilterChange = (value: [number, number]) => {
		let _filters = { ...filters }
		// @ts-ignore
		_filters['price'].value = value;
		setFilters(_filters);
		setPriceFilter(value);
	}
	const onEmaFilterChange = (value: [number, number]) => {
		let _filters = { ...filters }
		// @ts-ignore
		_filters['ema'].value = value;
		setFilters(_filters);
		setEmaFilter(value);
	}
	const onMacdFilterChange = (value: [number, number]) => {
		let _filters = { ...filters }
		// @ts-ignore
		_filters['macd'].value = value;
		setFilters(_filters);
		setMacdFilter(value);
	}
	const onSignalMacdFilterChange = (value: [number, number]) => {
		let _filters = { ...filters }
		// @ts-ignore
		_filters['signalMacd'].value = value;
		setFilters(_filters);
		setSignalMacdFilter(value);
	}

	const renderHeader = () => {
		return (
			<div className="flex justify-content-end">
				<IconField iconPosition="left">
					<InputIcon className="pi pi-search" />
					<InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Акция" />
				</IconField>
			</div>
		);
	};
	const header = renderHeader();

	return <div className='mx-8 mt-3 flex justify-content-center gap-4'>
		<Card className='border-round-2xl shadow-4'>
				<DataTable
					header={header}
					globalFilterFields={['instrument', 'price']}
					filters={filters}
					loading={indicatorsLoading}
					emptyMessage="Акции не найдены"
					value={rows}
					scrollable
					selectionMode="single"
					scrollHeight='44rem'
					style={{ minWidth: '60rem' }}
					onRowClick={(event) => navigate(`/stocks/${event.data.instrument}`)}
				>
					{columns.map((col, i) =>
						<Column field={col.name} header={col.title} key={i} />
					)}
				</DataTable>
		</Card>
		<Card className='border-round-2xl shadow-4' title='Фильтры'>
			{priceFilter && <div className="w-16rem">
				<div className="font-semibold mb-2">Цена</div>
				<InputText value={priceFilter[0].toFixed(3).toString()}
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPriceFilterChange([parseInt(e.target.value), priceFilter[1]])}
						   className="w-8rem"/>
				<InputText value={priceFilter[1].toString()}
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPriceFilterChange([priceFilter[0], parseInt(e.target.value)])}
						   className="w-8rem"/>
				{/*// @ts-ignore*/}
				<Slider onChange={(e: SliderChangeEvent) => onPriceFilterChange(e.value)} min={bounds[0].min} max={bounds[0].max}
						value={priceFilter} className="w-16rem mt-2" range/>
			</div>
			}
			{emaFilter && <div className="w-16rem mt-5">
				<div className="font-semibold mb-2">EMA</div>
				<InputText value={emaFilter[0].toFixed(3).toString()}
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmaFilterChange([parseInt(e.target.value), emaFilter[1]])}
						   className="w-8rem"/>
				<InputText value={emaFilter[1].toFixed(3).toString()}
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmaFilterChange([emaFilter[0], parseInt(e.target.value)])}
						   className="w-8rem"/>
				{/*// @ts-ignore*/}
				<Slider onChange={(e: SliderChangeEvent) => onEmaFilterChange(e.value)} min={bounds[1].min} max={bounds[1].max}
						 value={emaFilter} className="w-16rem mt-2" range/>
			</div>
			}
			{macdFilter && <div className="w-16rem mt-5">
				<div className="font-semibold mb-2">MACD</div>
				<InputText value={macdFilter[0].toFixed(3).toString()}
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMacdFilterChange([parseInt(e.target.value), macdFilter[1]])}
						   className="w-8rem"/>
				<InputText value={macdFilter[1].toFixed(3).toString()}
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMacdFilterChange([macdFilter[0], parseInt(e.target.value)])}
						   className="w-8rem"/>
				{/*// @ts-ignore*/}
				<Slider onChange={(e: SliderChangeEvent) => onMacdFilterChange(e.value)} min={bounds[2].min} max={bounds[2].max}
						className="w-16rem mt-2" range value={macdFilter}/>
			</div>
			}
			{signalMacdFilter && <div className="w-16rem mt-5">
				<div className="font-semibold mb-2">sgl MACD</div>
				<InputText value={signalMacdFilter[0].toFixed(3).toString()} className="w-8rem"
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSignalMacdFilterChange([parseInt(e.target.value), signalMacdFilter[1]])}
						   />
				<InputText value={signalMacdFilter[1].toFixed(3).toString()} className="w-8rem"
						   onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSignalMacdFilterChange([signalMacdFilter[0], parseInt(e.target.value)])}
						   />
				{/*// @ts-ignore*/}
				<Slider value={signalMacdFilter} className="w-16rem mt-2" range min={bounds[3].min} max={bounds[3].max}
				/*// @ts-ignore*/
						onChange={(e: SliderChangeEvent) => onSignalMacdFilterChange(e.value)}/>
			</div>
			}
		</Card>
	</div>
}
