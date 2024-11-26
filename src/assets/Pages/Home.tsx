import React from 'react';
import { createTheme } from '@mui/material/styles';
import CategoryIcon from '@mui/icons-material/Category';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate } from 'react-router-dom';

import type { Navigation, Router } from '@toolpad/core/AppProvider';
import MyBooks from './MyBooks';
import SearchBooks from './Search';
import AddBook from './AddBook';
import Gender from './Gender';  

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'books' },
  { segment: 'My-Books', title: 'My Books', icon: <MenuBookIcon /> },
  
  { segment: 'Categories', title: 'Genders ', icon: <CategoryIcon/> },
  { kind: 'divider' },
  { kind: 'header', title: 'Manage Books' },
  { segment: 'Add-Books', title: 'Add Books', icon: <BookmarkAddIcon /> },
  { segment: 'Search-Books', title: 'Search Books', icon: <ManageSearchIcon /> },
  { kind: 'divider' },
  {segment: 'Logout', title: 'Logout', icon: <MenuBookIcon />},
  
];

const Theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function PageContent({ pathname }: { pathname: string }) {
  const navigate = useNavigate();
  switch (pathname) {
    case '/My-Books':
      return (
          <MyBooks />
      );
    case '/Add-Books':
      return <AddBook />;

    case '/Search-Books':
      return <SearchBooks />;

      case '/Categories':
      return <Gender />;

      case '/Logout':
      navigate('/');
      localStorage.clear();
      return null;


    default:
      return null;
  }
}


interface Props {
  window?: () => Window;
}

export default function DashboardLayoutAccountSidebar(props: Props) {
  const { window } = props;
  const [pathname, setPathname] = React.useState('/My-Books');

  const router = React.useMemo<Router>(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => setPathname(String(path)),
  }), [pathname]);

  const Window = window ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={Theme} window={Window}>
      
      <DashboardLayout>
        <PageContent pathname={pathname} />
        
      </DashboardLayout>
          </AppProvider>
  );
}
