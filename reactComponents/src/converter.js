import { useEffect, useState } from "react";

export default function Converter({ currencies }) {
	const [amount, setAmount] = useState(1);

	// Initiate state with Lazy Callback
	const [base, setBase] = useState(function () {
		return currencies[0];
	});
	const [quote, setQuote] = useState(function () {
		return currencies[1];
	});
	const [ratio, setRatio] = useState();

	function handleBase(e) {
		const base = e.target.value;

		// If [[base]] currency changed to what [[quote]] currency is, change [[quote]] to what was [[base]] before
		if (base === "USD" && quote === "USD") {
			setQuote(localStorage.getItem("base"));
		}
		if (base === "EUR" && quote === "EUR") {
			setQuote(localStorage.getItem("base"));
		}
		if (base === "GBP" && quote === "GBP") {
			setQuote(localStorage.getItem(""));
		}
		setBase(e.target.value);
	}

	function handleQuote(e) {
		const quote = e.target.value;
		// If [[quote]] currency changed to what [[base]] currency is, change [[base]] to what was [[quote]] before
		if (base === "USD" && quote === "USD") {
			setBase(localStorage.getItem("quote"));
		}
		if (base === "EUR" && quote === "EUR") {
			setBase(localStorage.getItem("quote"));
		}
		if (base === "GBP" && quote === "GBP") {
			setBase(localStorage.getItem("quote"));
		}
		setQuote(e.target.value);
	}

	function handleAmount(e) {
		e.preventDefault();

		// if [[amount input]] isn't number data type
		if (isNaN(Number(e.target.value))) return;

		// set [[amount]] state
		setAmount(Number(e.target.value));
	}

	// pressing "Escape" to turning back text input to 1
	useEffect(function () {
		function callback(e) {
			if (e.code === "Escape") {
				setAmount(1);
			}
		}
		document.addEventListener("keydown", callback);
		return function (e) {
			document.removeEventListener("keydown", callback);
		};
	}, []);

	// fetch data from API whenever [[amount input]], [[base currency]] and [[quote currency]] changed
	useEffect(
		function () {
      // Create a new AbortController instance for each request
			const controller = new AbortController();

			async function FetchRatio() {
				try {
					// if [[amount input]] is zero
					if (amount === 0) {
						// 	console.log(e.target.value);
						setRatio(0);
						return;
					}

					const response = await fetch(
						`https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${quote}`,
					);
					const data = await response.json();

					// Catch Error with status code 422 from API
					if (response.status === 422) {
						console.log(data);
						throw new Error("zeroAmount");
					}

					const ratio = data.rates[quote];
					setRatio(ratio);
				} catch (err) {
					if (err.message !== "zeroAmount") {
						console.log(err.name);
					}
				}
			}
			FetchRatio();
			return function () {
        // effect cleanup function :  Cancel the fetch request if new request is made 
				controller.abort();
			};
		},
		[base, quote, amount],
	);

	// set a local [[key]] : [[value]] everytime [[base]] and [[quote]] change
	useEffect(
		function () {
			localStorage.setItem("base", base);
			localStorage.setItem("quote", quote);
		},
		[base, quote],
	);

	return (
		<div>
			<input type="text" value={amount} onChange={(e) => handleAmount(e)} />
			<select name="" id="" value={base} onChange={(e) => handleBase(e)}>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
				<option value="GBP">GBP</option>
			</select>
			<select name="" id="" value={quote} onChange={(e) => handleQuote(e)}>
				<option value="USD">USD</option>
				<option value="EUR">EUR</option>
				<option value="GBP">GBP</option>
			</select>
			<p>
				{" "}
				{ratio} {quote}
			</p>
		</div>
	);
}
