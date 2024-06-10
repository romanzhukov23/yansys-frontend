import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {useEffect, useState} from "react";
import {Column as ColumnType, Row} from "../../../shared/types";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {isAuthenticated} from "../../../auth/auth";

export function Favorites() {
    const navigate = useNavigate();
    const [indicatorsLoading, setIndicatorsLoading] = useState(false);
    const [isAuth] = useState<boolean>(isAuthenticated);
    const [rows, setRows] = useState<Row[]>([]);
    const [columns] = useState<ColumnType[]>([
        {name: 'id', title: '№', width: 'w-[3vw]'},
        {name: 'instrument', title: 'Акция', width: 'w-[6vw]'},
        {name: 'price', title: 'Цена', width: 'w-[8vw]'},
        {name: 'ema', title: 'EMA', width: 'w-[8vw]'},
        {name: 'macd', title: 'MACD', width: 'w-[8vw]'},
        {name: 'signalMacd', title: 'sgl MACD', width: 'w-[8vw]'},
        // {name: 'rsi', title: 'RSI', width: 'w-[8vw]'},
    ]);
    const fixFormat = (value: number) => {
        return value.toFixed(2).toString();
    }

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

            const getFavoriteIndicatorsQuery = {
                "query": `query { getLastFavoriteIndicators (username: "demo") { ticker price { close time } ema { value time } macd { value time } signal_macd { value time } } }`
            }

            axios.post(GRAPHQL_URL, getFavoriteIndicatorsQuery).then(
                r => {
                    indicators.push(...r.data.data.getLastFavoriteIndicators);
                    setRows(indicators.map((indicator, index) => ({
                        id: (index + 1).toString(),
                        instrument: indicator.ticker,
                        price: fixFormat(indicator.price.close),
                        ema: fixFormat(indicator.ema.value),
                        macd: fixFormat(indicator.macd.value),
                        signalMacd: fixFormat(indicator.signal_macd.value),
                        // rsi: '122',
                    })));
                    setIndicatorsLoading(false);
                }
            );
        }

        if (isAuth) fetchIndicators();
    }, [isAuth]);

    return <div className='mx-8 mt-3 flex justify-content-center'>
        {isAuth
            ?
            <Card className='border-round-2xl shadow-4'>
                    <DataTable
                        value={rows}
                        loading={indicatorsLoading}
                        emptyMessage="Пока никаких избранных акций"
                        scrollable
                        selectionMode="single"
                        scrollHeight='48rem'
                        style={{minWidth: '60rem', minHeight: '45rem'}}
                        onRowClick={(event) => navigate(`/stocks/${event.data.instrument}`)}
                    >
                        {columns.map((col, i) =>
                            <Column field={col.name} header={col.title} key={i}/>
                        )}
                    </DataTable>
            </Card>
            :
            <Card>Войдите, чтобы иметь список избранных акций</Card>}
    </div>
}