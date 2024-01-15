interface TickerDataProps {
	ticker: {
		instrument: string;
		price: string;
		ema: string;
	}
	update: any;
	index: number;
}

export function TickerData ({ ticker, update, index }: TickerDataProps): JSX.Element {
	console.log(ticker);

	return <tr onClick={() => update({ active: index })}>
		<td>{index}</td>
		<td>{ticker.instrument}</td>
		<td>{ticker.price}</td>
		<td>{ticker.ema}</td>
	</tr>;
}
