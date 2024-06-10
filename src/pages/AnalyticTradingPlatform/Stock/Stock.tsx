import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {GRAPHQL_URL} from "../../../shared/URL";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {ColorType, createChart, IChartApi, UTCTimestamp} from "lightweight-charts";
import {isAuthenticated} from "../../../auth/auth";

export function Stock() {
    const ticker = useParams().ticker;
    const [indicatorsLoading, setIndicatorsLoading] = useState(false);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
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
    const [quotes, setQuotes] = useState<IBar[]>();
    const [ema, setEma] = useState<ILine[]>();
    const [macd, setMacd] = useState<ILine[]>();
    const [signalMacd, setSignalMacd] = useState<ILine[]>();

    const fixFormat = (value: number) => {
        return value.toFixed(2).toString();
    }

    const onStarClick = () => {
        const graphqlQuery = {
            "query": `mutation {${isFavorite ? 'deleteFavorite' : 'addFavorite'} (username: "${localStorage.getItem('username')}", ticker: "${ticker}")}`
        }
        axios.post(GRAPHQL_URL, graphqlQuery).then((res) => console.log(res.data.data));
        setIsFavorite(!isFavorite);
        console.log(isFavorite);
    }

    useEffect(() => {
        const fetchIndicators = async () => {
            setIndicatorsLoading(true);

            if (isAuthenticated()) {
                const getFavoriteIndicatorsQuery = {
                    "query": `query { isFavorite (username: "${localStorage.getItem('username')}" ticker: "${ticker}") }`
                }

                axios.post(GRAPHQL_URL, getFavoriteIndicatorsQuery).then(
                    r => {
                        setIsFavorite(r.data.data.isFavorite);
                    });
            }

            const getIndicatorsByTickerQuery = {
                "query": `query { getIndicatorsByTicker (ticker: "${ticker}") { ticker price { open close low high time } ema { value time } macd { value time } signal_macd { value time } } }`
            }
            axios.post(GRAPHQL_URL, getIndicatorsByTickerQuery).then(r => {
                const data = r.data.data.getIndicatorsByTicker;
                setData({
                    price: fixFormat(data.price[data.price.length - 1].close),
                    ema: fixFormat(data.ema[data.ema.length - 1].value),
                    macd: fixFormat(data.macd[data.macd.length - 1].value),
                    signalMacd: fixFormat(data.signal_macd[data.signal_macd.length - 1].value),
                    // rsi: '122',
                });
                setEma(data.ema.map((e: { value: number; time: Date }) => ({...e, time: new Date(e.time).getTime() / 1000 as unknown as UTCTimestamp})));
                setMacd(data.macd.map((e: { value: number; time: Date }) => ({...e, time: new Date(e.time).getTime() / 1000 as unknown as UTCTimestamp})));
                setSignalMacd(data.signal_macd.map((e: { value: number; time: Date }) => ({...e, time: new Date(e.time).getTime() / 1000 as unknown as UTCTimestamp})));
                setQuotes(data.price.map((p: { open: number; close: number; low: number; high: number; time: Date; }) => ({
                    ...p,
                    time: new Date(p.time).getTime() / 1000 as unknown as UTCTimestamp,
                })));
                setIndicatorsLoading(false);
            });
        }
        fetchIndicators();
    }, [ticker]);

    return <div className='flex'>
        <Card
            className='w-3 m-4 border-round-2xl shadow-4'
            title={
                <div className='flex justify-content-between'>
                    <div>{ticker}</div>
                    <Button icon={isFavorite ? 'pi pi-star-fill' : 'pi pi-star'} rounded text aria-label="Favorite" onClick={onStarClick} />
                </div>}>
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
        <Card className='w-9 m-4 border-round-2xl shadow-4 width' style={{height: '85vh'}}>
            {(quotes && ema && macd) && <ChartContainer quotes={quotes} EMA={ema} MACD={macd} signalMACD={signalMacd} />}
        </Card>
    </div>
}

export interface ILine {
    value: number;
    time: UTCTimestamp;
}

export interface IBar {
    time: UTCTimestamp;
    open: number;
    volume?: number;
    close: number;
    high: number;
    low: number;
}

function ChartContainer({ quotes, EMA, MACD, signalMACD }: {
    quotes: IBar[];
    EMA?: ILine[];
    MACD?: ILine[];
    signalMACD?: ILine[];}) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<any>(null);

    // Initialize the chart
    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                height: 750,
                layout: {
                    background: { type: ColorType.Solid, color: 'white' },
                },
            });

            chart.timeScale().applyOptions({ timeVisible: true });
            chart.timeScale().fitContent();

            const EMASeries = chart.addLineSeries({
                color: 'rgb(255, 255, 0)',
                title: 'EMA',
                crosshairMarkerVisible: false,
                lineWidth: 1,
            });
            if (EMA) {
                EMASeries.setData(EMA);
            }

            const MACDSeries = chart.addLineSeries({
                color: 'rgb(0,178,255)',
                title: 'MACD',
                priceScaleId: '',
                crosshairMarkerVisible: false,
                lineWidth: 1,
            });
            if (MACD) {
                MACDSeries.setData(MACD);
            }

            const signalMACDSeries = chart.addLineSeries({
                color: 'rgb(0, 0, 255)',
                title: 'signalMACD',
                priceScaleId: '',
                crosshairMarkerVisible: false,
                lineWidth: 1,
            });
            if (signalMACD) {
                signalMACDSeries.setData(signalMACD);
            }

            const candleSeries = chart.addCandlestickSeries({
                upColor: 'rgb(0, 205, 0)',
                downColor: 'rgb(255, 0, 0)',
            });
            candleSeries.setData(quotes);

            // Store the created chart and series in refs
            chartRef.current = chart;
            candlestickSeriesRef.current = candleSeries;
        }
    }, [quotes, EMA, MACD, signalMACD]); // Dependencies array ensures this effect runs once

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.resize(chartContainerRef.current.offsetWidth, 750);
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            <div ref={chartContainerRef}></div>
        </div>
    );
}