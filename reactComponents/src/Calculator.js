import { useEffect, useReducer } from 'react';

// * useReduce
const initialState = {
  base: 'USD',
  quote: 'EUR',
  rate: 0,
  amount: 0,
  openPrice: 0,
  closePrice: 0,
  risk: 0,
};
function reducer(curState, action) {
  switch (action.type) {
    case 'rateCalculator':
      return { ...curState };
    case 'pipValueCalculator':
      return { ...curState };
    case 'profitCalculator':
      return { ...curState };
    case 'volumeCalculator':
      return { ...curState };
    default:
      throw new Error('unknown type');
  }
}

// * App Component
export default function App() {
  const [newState, dispatch] = useReducer(reducer, initialState);
  const { base, quote, ratio } = newState;

  // + useEffect
  //   useEffect(
  //     function () {
  //       async function FetchRatio() {
  //         const response = await fetch(
  //           `https://api.frankfurter.app/latest?amount=${}&from=${}&to=${}`,
  //         );
  //         const data = await response.json();
  //       }
  //       FetchRatio();
  //     },
  //     [],
  //   );

  // + JSX
  return (
    <div>
      <header className="bg-red-300">
        <h1 className="p-5 text-center text-6xl text-white subpixel-antialiased">
          Forex Calculator
        </h1>
      </header>

      <section>
        <div className="">
          <div class="m-4 flex flex-row flex-wrap justify-center">
            <select
              name="base"
              className="mx-4 my-8 basis-auto border-0 border-b-2 focus:border-red-200 focus:outline-none focus:ring-0"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>

            <select
              name="quote"
              className="mx-4 my-8 basis-auto border-0 border-b-2 focus:border-red-200 focus:outline-none focus:ring-0"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
            <input
              type="text"
              placeholder="Volume"
              className="mx-4 my-8 basis-auto border-0 border-b-2 focus:border-red-200 focus:outline-none focus:ring-0"
            />
            <input
              type="text"
              placeholder="rate"
              disabled={true}
              className="mx-4 my-8 basis-auto border-0 border-b-2 focus:border-red-200 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
