import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import CryptoSummary from './components/CryptoSummary';
import { Crypto } from './CryptoTypes';
import { Pie } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  Tooltip,
  Legend,
  ArcElement
);


function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto[]>([]);

  const [data, setData] = useState<ChartData<'pie'>>();


  useEffect(() => {
    const url =
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  /*
  useEffect(() => {
    if(!selected) return;
    axios
            .get(
              `https://api.coingecko.com/api/v3/coins/${selected?.id}/market_chart?vs_currency=usd&days=${range}&${range === 1 ? 'interval=hourly' : `interval=daily`}`
            )
            .then((response) => {
              setData({
                labels: response.data.prices.map((price: number[])=>{
                  return moment.unix(price[0]/1000).format(range === 1 ? 'HH:MM' : 'MM-DD');
                }),
                datasets: [
                  {
                    label: 'Dataset 1',
                    data: response.data.prices.map((price: number[])=>{
                      return price[1]
                    }),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                ],
              });
              setOptions({
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  title: {
                    display: true,
                    text: `${selected?.name}Price Over Last ` + range + (range === 1 ? ' Day.' : 'Days.'),
                  },
                },
              })
            });
  }, [selected, range]);
  */

  useEffect(() => {
    console.log("SELECTED:", selected);

    if(selected.length === 0) return;
    setData({
      labels: selected.map((s) => s.name),
      datasets: [
        {
          label: '# of Votes',
          data: selected.map((s) => s.owned * s.current_price),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [selected])

  function updateOwned(crypto: Crypto, amount: number): void {
    console.log('updateOwned', crypto, amount);
    let temp = [...selected];
    let tempObj = temp.find((c) => c.id === crypto.id)
    if (tempObj) {
      tempObj.owned = amount;
      setSelected(temp);
    }

  }

  return (
    <>
      <div className="App">
        <select onChange={(e) => {
          const c = cryptos?.find((x) => x.id === e.target.value) as Crypto;
          setSelected([...selected, c]);
        }}
          defaultValue='default'
        >
          <option value='default'>Choose an Option</option>
          {cryptos ?
            cryptos.map((crypto) => {
              return <option
                key={crypto.id} value={crypto.id}>
                {crypto.name}
              </option>
            })
            : null
          }
        </select>

      </div>

      {selected.map((s) => {
        return <CryptoSummary crypto={s} updateOwned={updateOwned} />
      })}

      {/*selected ? <CryptoSummary crypto={selected} /> : null*/}

      {data ? (
        <div
          style={{ width: 600 }}>
          <Pie data={data} />
        </div>)
        : null}

      {selected
        ? 'Your Portfolio is Worth$' +
        selected.map((s) => {
          if (isNaN(s.owned)) {
            return 0;
          }
          return s.current_price * s.owned;
        }).reduce((prev, curr) => {
          console.log('Prev', prev, 'Curr', curr)
          return prev + curr;
        }, 0).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        : null}

    </>
  );

}

export default App;
