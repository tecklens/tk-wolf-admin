import {
  IconBoxSeam,
  IconBrandMantine,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconHierarchy2,
  IconLayoutDashboard,
  IconMailAi,
  IconRouteAltLeft,
  IconSettings,
  IconTruck,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href?: string
  icon: any
  variant?: any
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    // label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Workflows',
    // label: '5',
    href: '/workflow',
    icon: <IconHierarchy2 size={18} />,
  },
  {
    title: 'Tasks',
    // label: '3',
    href: '/tasks',
    icon: <IconChecklist size={18} />,
  },
  // {
  //   title: 'Layout',
  //   label: '',
  //   href: '/layout',
  //   icon: <IconCode size={18} />,
  // },
  {
    title: 'Subscription',
    // label: '',
    href: '/subscription',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Members',
    // label: '',
    href: '/members',
    icon: <IconUsersGroup size={18} />,
  },
  {
    title: 'Requests',
    // label: '10',
    href: '/requests',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'Log trigger',
        // label: '9',
        href: '/requests/log-trigger',
        icon: <IconTruck size={18} />,
      },
      // {
      //   title: 'Cargos',
      //   label: '',
      //   href: '/cargos',
      //   icon: <IconBoxSeam size={18} />,
      // },
    ],
  },
  {
    title: 'Brand',
    // label: '',
    href: '/brand',
    icon: <IconBrandMantine size={18} />,
  },
  {
    title: 'Analysis',
    // label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'Provider',
    label: '',
    href: '/provider',
    icon: <IconComponents size={18} />,
  },
  // {
  //   title: 'MailX',
  //   label: '',
  //   href: '/mailx',
  //   icon: <IconMailAi size={18} />,
  // },
  // {
  //   title: 'Error Pages',
  //   label: '',
  //   href: '',
  //   icon: <IconExclamationCircle size={18} />,
  //   sub: [
  //     {
  //       title: 'Not Found',
  //       label: '',
  //       href: '/404',
  //       icon: <IconError404 size={18} />,
  //     },
  //     {
  //       title: 'Internal Server Error',
  //       label: '',
  //       href: '/500',
  //       icon: <IconServerOff size={18} />,
  //     },
  //     {
  //       title: 'Maintenance Error',
  //       label: '',
  //       href: '/503',
  //       icon: <IconBarrierBlock size={18} />,
  //     },
  //   ],
  // },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
