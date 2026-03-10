import type { Route } from "./+types/list";
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import instance from './reuse/api.tsx';

export default function List() {
	const [list, setList] = useState(new Array());
	let a = useRef(true);
	useEffect(() => {
    const c = 10;
    let i = 0;
    let shouldContinue = true;

    const fetchData = async () => {
      while (shouldContinue) {
        try {
	const response = await instance.get('/list', {
            params: { start: i, chunk: c },
          });

          const data = response.data;
          if (Object.keys(data).length === 0) {
            shouldContinue = false;
          } else {
            setList(prev => [...prev, ...Object.entries(data).map(([id, text]) => ({id, text}))]);
            i += c;
          }
        } catch (err) {
          shouldContinue = false;
        }
      }

    };

    fetchData();
  }, []);

	return (<div className="min-h-screen bg-black text-white p-6 dark:bg-black">
 <div className="space-x-4">
	<Link to='/add'><button className="border-4 border-green-500 text-white bg-black font-mono tracking-wider px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-900 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-70">Add</button></Link>
	<Link to='/'><button className="border-4 border-red-500 text-white bg-black font-mono tracking-wider px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-900 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-70">Back</button></Link>
	<br />
</div>
	<ul className="space-y-2">
	{
		list.map(
		({id, text}) => (
		<li key={id} className="border-l-2 border-b-2 border-green-500 p-2 rounded-md bg-black hover:bg-gray-900 transition duration-200">
		<Link to={`/quest/${id}`} className="text-white no-underline">
		<p className="text-lg"><strong>{text}</strong>
</p>

		</Link>
		</li>		
		)
		)
	}
</ul>
		</div>);
}
