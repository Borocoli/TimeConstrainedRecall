import { useState } from 'react';

export default function Quest({title, opts, id, func}) {
	const [err, setErr] = useState(false);
	const opts2 = opts.map((opt, index) => ({id: index, opt: opt}));
	const compopts = opts2.map(opt => <div key={opt.id}>
				   	<input type="radio" id={`${opt.id}`}  name="opts" value={opt.id.toString()} defaultChecked={opt.id === id} className="h-5 w-5 focus:ring-green-500 border-2 border-green-500"/>
					<input type="text" htmlFor={`${opt.id}`} name={`o${opt.id}`} defaultValue={opt.opt} className=" bg-black text-white border border-green-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
/>
					<br />
				   </div>);
	function prepare(formData) {
if (!formData.get('title') || !formData.get('opts')) {
      setErr(true);
      return;
    }
		let title = formData.get('title');
		let opt = formData.get('opts');

		let variants = {};
		opts2.forEach((opt) => {
if(!formData.get(`o${opt.id}`)) {
      setErr(true);
      return;
}
			let tmp = formData.get(`o${opt.id}`);

variants[opt.id] = tmp;
		});
setErr(false);
		func({
		text:title,
		opts: variants,
		correct: parseInt(opt)
		});
	}
	return (<div className="bg-black text-white p-6 dark:bg-black">
	      <form action={prepare} className="space-y-2">
	       	<input type="text" id="title" name="title" defaultValue={title} className="text-xl font-medium"/>
		<br />
		{compopts}
	       	<input type="submit" className="bg-green-500 text-black font-semibold py-2 px-6 rounded hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
          />

	      </form>
{err && (
<p className="text-red-500">
You need to set every value.
</p>)
	}       </div>);
}
