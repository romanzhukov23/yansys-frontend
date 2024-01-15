import {TickerData} from "./TickerData";

interface TickerListProps {
	data: {
		instrument: string
		price: string
		ema: string
		index: number
	}[]
	update: any
}

export function TickerList ({ data, update }: TickerListProps): JSX.Element {
	if (!data) { return (<p>Loading...</p>); }

	const tickers = data.map((ticker, index) => {
		return (<TickerData ticker={ticker} index={index} key={`ticker-${index}`} update={update} />);
	});

	console.log(tickers);

	return <table className="user-list table table-striped">
		<thead>
		<tr>
			<th>№</th>
			<th>Инструмент</th>
			<th>Цена</th>
			<th>EMA</th>
		</tr>
		</thead>
		<tbody>
		{tickers}
		</tbody>
	</table>
}
