import { useEffect, useState } from "react";
import axios from "axios";
import Chart from "./chart/Chart";
import MultilineChart from "./chart/multilineChart/MultilineChart";

const key = process.env.REACT_APP_ALPHA_KEY;
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${Symbol}&apikey=${key}`;

interface Alpha {
  "1. open": string;
  "2. high": string;
  "3. low": string;
  "4. close": string;
  "5. adjusted close": string;
  "6. volume": string;
  "7. divided amount": string;
  date: Date;
}

const dimensions = {
  width: 600,
  height: 300,
  margin: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 60,
  },
};

const Finance = () => {
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState("");
  const getSymbol = async (Symbol: string) => {
    if (!data.some(s => s.name === Symbol)){
      const res = await (
        await axios.get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${Symbol}&apikey=${key}`
          // `${Symbol}.json`
        )
      ).data;
      const timeseries = res?.["Weekly Adjusted Time Series"];
      let timeStamps = Object.keys(timeseries);//.reverse();
      timeStamps.forEach((t) => {
  
        timeseries[t]["date"] = new Date(t);
      });
      const ObjToArray: Alpha[] = Object.values(timeseries);
  
      setData((p) => [
        ...p,
        {
          name: Symbol,
          color: (Symbol === 'query' ? "#d53e4f" : "#0074E4"),
          items: ObjToArray.map((o) => ({
            date: o.date,
            open: parseFloat(o["1. open"]),
          })),
        },
      ]);
    } else {
      console.log('already added');
    }
    
  };

  useEffect(() => {
    //getSymbol("query");
    return () => {};
  }, []);
  useEffect(() => {
    //console.log(data);
  }, [data]);
  return (
    <div>
      <p>Finance</p>
      <input
        className="border"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={(e) => {
          getSymbol(value);
          setValue("");
        }}
        className="border"
      >
        find
      </button>
      {data?.length > 0 && (
        <div className="flex flex-col space-y-5">
          <Chart data={data} dimensions={dimensions} />
          <MultilineChart data={data} margin={dimensions.margin}/>
          <div className="h-10 bg-blue-400">
            {data.map((s,i) => (
              <div className="flex flex-row" key={s.name+i}>
                <p>{s.name}</p>
                <button onClick={e => setData(p => p.filter(d => d.name !== s.name))}>{'(clear)'}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
