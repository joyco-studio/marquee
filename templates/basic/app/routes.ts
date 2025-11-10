import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [index('routes/home/index.tsx'), route('/test', 'routes/test/index.tsx')] satisfies RouteConfig
