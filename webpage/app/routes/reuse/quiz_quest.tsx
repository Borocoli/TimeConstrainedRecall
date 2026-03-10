

export default function Quest({title, opts, id, func}) {
	const opts2 = opts.map((opt, index) => ({id: index, opt: opt}));
	const compopts = opts2.map(opt => <div className="space-x-2 space-y-2">
				   	<input type="radio" id={`${opt.id}`}  name="opts" value={opt.id.toString()} className="h-5 w-5 focus:ring-green-500 border-2 border-green-500"/>
					<label for={`${opt.id}`} className=" bg-black text-white text-l"
>{opt.opt} </label>
					<br />
				   </div>);
	function prepare(formData) {
		let title = formData.get('title');
		let opt = formData.get('opts');
		func(parseInt(opt));
	}
	return (<>
	      <form action={prepare}>
		<h1 className="text-xl">{title}</h1>
		<br />
		{compopts}
	       	<input type="submit" value="Next" className="bg-green-500 text-black font-semibold py-2 px-6 rounded hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"/>

	      </form>
	       </>);
}
