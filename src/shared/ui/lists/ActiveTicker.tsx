interface ActiveTickerProps {
	data: {
		instrument: string;
		price: string;
		ema: string;
	}[]
	active: number;
}

export function ActiveTicker ({ data, active }: ActiveTickerProps): JSX.Element {
	if (!data || !data[active]) { return <h3>Nothing found :(</h3>; }

	const ticker = data[active];

	return (
		<div className="thumbnail">
			<div className="thumbnail-caption">
				<h3>{ticker.instrument}</h3>
				<table className="user-info table table-responsive">
					<tbody>
					<tr>
						<td>Цена:</td>
						<td>{ticker.price}</td>
					</tr>
					<tr>
						<td>EMA:</td>
						<td>{ticker.ema}</td>
					</tr>
					</tbody>
				</table>

				{/*<p><b>Favorite phrase:</b> {user.phrase}</p>*/}
			</div>
		</div>
	);
};