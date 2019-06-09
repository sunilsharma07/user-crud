export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: any;
  title?: boolean;
  children?: any;
  variant?: string;
  attributes?: object;
  divider?: boolean;
  class?: string;
  label?: any;
  wrapper?: any;
}

export const navItems: NavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  }, 
  {
    name: 'Members',
    url: '/memberlist',
    icon: 'icon-pie-chart'
  },
  {
    name: 'TaskList',
    url: '/tasklist',
    icon: 'icon-pie-chart'
  },
  
];
