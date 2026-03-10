import type { Route } from "./+types/add";
import {Link} from 'react-router';
import {useState, useEffect} from 'react';
import Quest from './reuse/quest.tsx'; 
import instance from './reuse/api.tsx';



function send(data) {
	const ndata = {
	...data,
	opts: Object.values(data.opts),
	};
	instance.post('/questions', ndata).then(function (response) {
		//console.log(response.data);
	}).catch(function (error) {
		//console.log(error);
	});
}

export default function Add() {
	const [ array, setArray ] = useState(new Array());
	useEffect(() => {
	instance.get('/opts').then(function (response) {
		setArray(new Array(response.data['opts']).fill(''));


	}).catch(function (error) {
		//console.log(error);
	
	});}, []);
	return (<div className="min-h-screen bg-black text-white p-6 dark:bg-black">
<Quest title='Question' opts={array} id={-1} func={(data) => send(data)} /></div>);

} 
