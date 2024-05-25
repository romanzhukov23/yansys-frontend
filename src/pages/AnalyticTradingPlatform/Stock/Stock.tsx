import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export function Stock() {
    const ticker = useParams().ticker;
    const [indicatorsLoading, setIndicatorsLoading] = useState(false);
    const [data, setData] = useState<{
        price: string,
        ema: string,
        macd: string,
        signalMacd: string
    }>({
        price: "",
        ema: "",
        macd: "",
        signalMacd: "",
    });

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

            const getIndicatorsByTickerQuery = {
                "query": `query { getIndicatorsByTicker (ticker: "${ticker}") { ticker AllArray { price time ema macd signalMacd } period } }`
            }
            axios.post(GRAPHQL_URL, getIndicatorsByTickerQuery).then(r => {
                const indicators = r.data.data.getIndicatorsByTicker;
                setData({
                    price: indicators.AllArray[indicators.AllArray.length - 1].price.toFixed(2).toString(),
                    ema: indicators.AllArray[indicators.AllArray.length - 1].ema.toFixed(2).toString(),
                    macd: indicators.AllArray[indicators.AllArray.length - 1].macd.toFixed(2).toString(),
                    signalMacd: indicators.AllArray[indicators.AllArray.length - 1].signalMacd.toFixed(2).toString(),
                    // rsi: '122',
                })
            });

            setIndicatorsLoading(false);
        }
        fetchIndicators();
    }, []);

    return <Card
        className='max-w-25rem m-4 border-round-2xl shadow-4'
        title={ticker}>
        {
            indicatorsLoading
            ?
                'Загрузка...'
            :
                <DataTable
                    value={[
                        {field: 'Цена', value: data?.price},
                        {field: 'EMA', value: data?.ema},
                        {field: 'От линии тренда на', value: `${(parseFloat(data?.price) * 100 / parseFloat(data?.ema) - 100).toFixed(2)}%`},
                        {field: 'MACD', value: data?.macd},
                        {field: 'sgl MACD', value: data?.signalMacd},
                        {field: 'Разница MACD и сигнальной MACD', value: `${(parseFloat(data?.macd) - parseFloat(data?.signalMacd)).toFixed(2)}%`},
                    ]}
                >
                    <Column field="field" header="Свойство"></Column>
                    <Column field="value" header="Значение"></Column>
                </DataTable>
        }
    </Card>
}
//
// <div>
//         <div className='text-xl flex flex-col w-[19vw] bg-gray-200 p-4 rounded-xl shadow-2xl'>
//             <div className='self-center text-4xl'>{data?.instrument.toString()}</div>
//             <div className='flex'>
//                 <div className='pt-1 self-start '>Цена:</div>
//                 <div className='pt-1 self-start ml-auto'>{data?.price.toString()}</div>
//             </div>
//             <div className='flex'>
//                 <div className='pt-1 self-start '>EMA:</div>
//                 <div className='pt-1 self-start ml-auto'>{data?.ema.toString()}</div>
//             </div>
//             <div className='flex'>
//                 <div className='pt-1 self-start '>От линии тренда на:</div>
//                 <div
//                     className='pt-1 self-start ml-auto'>{}%
//                 </div>
//             </div>
//             <div className='flex'>
//                 <div className='pt-1 self-start '>MACD:</div>
//                 <div className='pt-1 self-start ml-auto'>{.toString()}</div>
//             </div>
//             <div className='flex'>
//                 <div className='pt-1 self-start '>sgl MACD:</div>
//                 <div className='pt-1 self-start ml-auto'>{.toString()}</div>
//             </div>
//             <div className='flex flex-row justify-center items-center content-center'>
//                 <div className='flex pt-1 self-start '>Разница MACD и сигнальной MACD:</div>
//                 <div
//                     className='flex pt-1 ml-auto justify-center content-center items-center'>{.toString()}</div>
//             </div>
//             {/*<div className='flex'>*/}
//             {/*	<div className='pt-1 self-start '>RSI:</div>*/}
//             {/*	<div className='pt-1 self-start ml-auto'>{data.rsi.toString()}</div>*/}
//             {/*</div>*/}
//         </div>
//     }
// </div>