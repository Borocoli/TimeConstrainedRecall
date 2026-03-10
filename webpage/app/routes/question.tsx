import type { Route } from "./+types/question";
import {Link, useNavigate} from 'react-router';
import {useState, useEffect} from 'react';
import Quest from './reuse/quest.tsx'; 
import instance from './reuse/api.tsx';


export async function clientLoader({params,}: Route.ClientLoaderArgs) {
	const res = await instance.get(`/questions/${params.questId}`);
	const p = res.data;
	return p;
}


function send(data, id, nav) {
	instance.put(`/questions/${id}`, data).then(function (response) {
		nav('/list');
	}).catch(function (error) {
		console.log(error);
	});

}



function Button({idd, nav}) {
	function deleteQ() {
	instance.delete(`/questions/${idd}`).then(function (response) {
		nav('/list');
	}).catch(function (error) {
		console.log(error);
	});
	}
	return <button onClick={deleteQ} className="border-4 border-red-500 text-white bg-black font-mono tracking-wider px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-900 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-70">Delete </button>;
}

export default function Question({loaderData, }: Route.ComponentProps) {
	const idd = loaderData.id;
	let nav = useNavigate();

	return (<div className="min-h-screen bg-black text-white p-6 dark:bg-black">
<Quest title={loaderData.text} opts={loaderData.opts} id={loaderData.correct} func={(data) => send(data, idd, nav)} />
<Button idd={idd} nav={nav}/>
</div>);

} 
