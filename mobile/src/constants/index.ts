import { FC } from 'react'

import Home from '../pages/Home'
import Points from '../pages/Points'
import Detail from '../pages/Detail'

interface Route {
  name: string;
  component: FC;
}

const ROUTE_NAMES = {
  home: 'Home',
  points: 'Points',
  detail: 'Detail'
}

const ROUTES: Route[] = [
  {
    name: ROUTE_NAMES.home,
    component: Home,
  },
  {
    name: ROUTE_NAMES.points,
    component: Points,
  },
  {
    name: ROUTE_NAMES.detail,
    component: Detail,
  },
]

const COLORS = {
  primary: '#34cb79'
}

export { ROUTES, ROUTE_NAMES, COLORS }