import { useEffect, useState } from "react";

export default function App() {
	const [amount, setAmount] = useState(1);
	const [base, setBase] = useState("USD");
	const [quote, setQuote] = useState("EUR");
	const [ratio, setRatio] = useState();

	function handleBase(e) {
		const base = e.target.value;
		if (base === "USD" && quote === "USD") {
			setQuote("EUR");
		}
		if (base === "EUR" && quote === "EUR") {
			setQuote("USD");
		}
		if (base === "GBP" && quote === "GBP") {
			setQuote("USD");
		}
		setBase(e.target.value);
	}

	function handleQuote(e) {
		const quote = e.target.value;
		if (base === "USD" && quote === "USD") {
			setBase("EUR");
		}
		if (base === "EUR" && quote === "EUR") {
			setBase("USD");
		}
		if (base === "GBP" && quote === "GBP") {
			setBase("USD");
		}
		setQuote(e.target.value);
	}

	function handleAmount(e) {
		console.log(e.target.value);
		e.preventDefault();
		if (isNaN(Number(e.target.value))) return;
		if (e.target.value == 0) {
			console.log(e.target.value);
			return setAmount(0);
		}
		setAmount(Number(e.target.value));
	}

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

	useEffect(
		function () {
			const controller = new AbortController();
			async function FetchRatio() {
				try {
					const response = await fetch(
						`https://api.frankfurter.app/latest?amount=${amount}&from=${base}&to=${quote}`,
					);
					const data = await response.json();
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
				controller.abort();
			};
		},
		[base, quote, amount],
	);

	return (
		<div>
			<form action="">
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
			</form>
			<p> {ratio} </p>
		</div>
	);
}
