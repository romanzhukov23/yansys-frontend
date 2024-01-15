export interface RowType extends Record<string, string | number>{
	id: string
	instrument: string;
	price: string;
	ema: string;
	macd: string;
	signalMacd: string;
	// rsi: string;
}

export interface ColumnType {
	title: string
	name: string
	width: string
}

export interface CellType {
	row: RowType
	column: ColumnType
}

export interface TableProps {
	columns: ColumnType[]
	data: RowType[]
	className?: string
	selectActive?: any
}

export function Cell({row, column}: CellType): JSX.Element {
	return <div className={`flex items-center justify-left px-[10px] ${column.width}`}>{row[column.name]}</div>
}

export function HeaderCell({column}: { column: ColumnType }): JSX.Element {
	return <div className={`flex items-center px-[10px] justify-left text-gray-500 font-semibold ${column.width}`}>{column.title}</div>
}

export function Row({row, columns, selectActive}: { row: RowType; columns: ColumnType[], selectActive?: any}): JSX.Element {
	return <div className="hover:cursor-pointer flex items-center h-[40px] border-b border-b-slate-600" onClick={() => {
		selectActive(row);
		console.log(row.id);
	}}>
		{columns.map(column => <Cell key={column.name} row={row} column={column}/>)}
	</div>
}

export function Table({data, columns, className, selectActive}: TableProps): JSX.Element {
	return <div className={className}>
		<div className="flex h-[40px] border-b border-b-slate-100">
			{columns.map(column => <HeaderCell key={column.name} column={column}/>)}
		</div>
		<div className="max-h-[80vh] overflow-y-scroll">
			{data.map(row => <Row selectActive={selectActive} key={row.id} row={row} columns={columns}/>)}
		</div>
	</div>
}
