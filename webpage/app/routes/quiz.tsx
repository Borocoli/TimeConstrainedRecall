import type { Route } from "./+types/Quiz";
import React, { useState, useEffect, useRef } from 'react';
import instance from './reuse/api.tsx';

import Quest from './reuse/quiz_quest.tsx'; 
import {Link} from 'react-router';



export default function Quiz() {
	const [time, setTime] = useState(0);
	const [step, setStep] = useState(-1);
	const [ array, setArray ] = useState(new Array());

	const ans = useRef([]); 
	const ansay = useRef([]); 


	function timerStart(t) {
		const tt = parseInt(t.get('timer'));
		setTime(tt);
		instance.get('/quiz', {params:{n: tt, t: tt}}).then(function (response) {
			setArray(response.data);	

		}).catch(function (error) {
			console.log(error);

		});
		setStep(0);

		setTimeout(() => {setStep(tt);}, tt*60*1000 );
	}
	function readAns(idd, anss) {
		ans.current.push({id: idd, correct: (anss === array[step].correct)});
		if (ans != array[step].correct) {
			ansay.current.push({id: step, ans: anss});
		}

		setStep(step+1);	
	}

	if (step < 0) {
		return (<div className="min-h-screen min-w-full bg-black text-white font-mono p-4 space-x-4">
			<form action={timerStart} className="space-y-2">
			<h1 className="text-xl">Choose time for test:</h1>
					<br/>
				<input type="text" name="timer" className="border-4 border-green-500"/> mins <br />
			<input type="submit" className="bg-green-500 text-black font-semibold py-2 px-6 rounded hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
  />
			</form>
			</div>);
	} if (step >= time) {
		instance.put('/quiz/submit', {'answers': ans.current}).then(function (response) {
			console.log(response.data);
		}).catch(function (error) {
			console.log(error);
		});

		return (<div className="min-h-screen min-w-full bg-black text-white font-mono p-4 space-x-4 space-y-2">
			<h1 className="text-xl">Quiz finished</h1>
			<table className="w-full border-collapse border border-green-500">
			<thead>
			<tr>
			<th className="text-l">Question</th>
			<th className="text-l">Your answer</th>
			<th className="text-l">Correct answer</th>
			</tr>
			</thead>
			<tbody  className="border-collapse border border-green-500">
			{ansay.current.map( (e) => {
				return (
					<tr key={e.id}>
					<td className="border border-green-500 p-4 text-center">{array[e.id].text}</td>
					<td className="border border-green-500 p-4 text-center">{array[e.id].opts[e.ans]}</td>

					<td className="border border-green-500 p-4 text-center">{array[e.id].opts[array[e.id].correct]}</td>
					</tr>
				);
			}
					  )}
					  </tbody>
					  </table>
					  <Link to='/'><button className="border-4 border-red-500 text-white bg-black font-mono tracking-wider px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-900 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-70"> Back</button></ Link>
					  </div>);
	}else {
		if (array.length === 0) {
			return <div className="min-h-screen min-w-full bg-black text-white font-mono p-4 space-x-4"><h1>Loading questions...</h1></div>
		}
		return (<div className="min-h-screen min-w-full bg-black text-white font-mono p-4 space-x-4"><Quest title={array[step].text} opts={array[step].opts} id={array[step].id} func={(data) => readAns(array[step].id, data)} /></div>);

	}
}

