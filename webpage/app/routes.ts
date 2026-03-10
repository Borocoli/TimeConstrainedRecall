import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("list", "routes/list.tsx"),
	route("add", "routes/add.tsx"),
	route('quest/:questId', 'routes/question.tsx'),
route("quiz", "routes/quiz.tsx"),
] satisfies RouteConfig;
