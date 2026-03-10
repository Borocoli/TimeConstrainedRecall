import type { Route } from "./+types/home";
import {Link} from 'react-router';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

function Button({name, path}) {
	return <button className="border-4 border-green-500 text-white bg-black font-mono tracking-wider px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:bg-gray-900 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-70">{name} </button>;
}

export default function Home() {
  return (<>
<div className="min-h-screen min-w-full bg-black text-white font-mono p-4 space-x-4">

	  <Link to='/list' className="flex-1">
	  <Button name='Questions'/>
	  </Link>

	  <Link to='/quiz' className="flex-1">

	  <Button name='Start Quizz'/>
	  </Link>
</div>
	  </>);
}
