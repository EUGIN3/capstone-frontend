import * as React from 'react';
import PropTypes from 'prop-types';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';


import logo from '../../assets/estrope-logo.png';
import demoTheme from './theme';
import AppRoutes from './AppRoutes';
import navigation from './navigation'

function Navbar({ window }) {
  const location = useLocation();

  const navigate = useNavigate(); 

  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };

  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState({
    user: {
      name: 'Leslie Faith Nvaja',
      email: 'sample@gmail.com',
      image: 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/475256800_1257300468707046_5844662227146863459_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGzU0pPQ5gM5YQ8qnQiBnEmhOevaeCSRyCE569p4JJHIDHVQHvWU1fgWMBlBA9aL0qD7XYk_azoiipOJXj4_Eon&_nc_ohc=K8wgMceyQ80Q7kNvwHhth76&_nc_oc=AdnFhB9qqvy0h1N_jmR2-jfyvKWgUImDZ_mg4IESAZH5bFE2OUniKPzSId1pRfyDAoc&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=Iwq4bn1SXP5cg8dyuxY-Lw&oh=00_AfECMfRjc2I62OJnq-fYfEN9Spa3OAoJajXHH9fxE_hwxw&oe=680A6129',
    },
  });

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: 'Leslie Faith Nvaja',
            email: 'sample@gmail.com',
            image: 'https://scontent.fmnl13-2.fna.fbcdn.net/v/t39.30808-6/475256800_1257300468707046_5844662227146863459_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGzU0pPQ5gM5YQ8qnQiBnEmhOevaeCSRyCE569p4JJHIDHVQHvWU1fgWMBlBA9aL0qD7XYk_azoiipOJXj4_Eon&_nc_ohc=K8wgMceyQ80Q7kNvwHhth76&_nc_oc=AdnFhB9qqvy0h1N_jmR2-jfyvKWgUImDZ_mg4IESAZH5bFE2OUniKPzSId1pRfyDAoc&_nc_zt=23&_nc_ht=scontent.fmnl13-2.fna&_nc_gid=Iwq4bn1SXP5cg8dyuxY-Lw&oh=00_AfECMfRjc2I62OJnq-fYfEN9Spa3OAoJajXHH9fxE_hwxw&oe=680A6129',
          },
        });
      },
      signOut: () => {
        setSession(null);
      },
    };
  }, []);

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={navigation}
      router={ router }
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: <img src={logo} alt="Ramil's logo." style={{ height: 40 }} />,
        title: 'RAMILE STROPE',
        homeUrl: '/app/dashboard',
      }}
    > 
      <DashboardLayout sidebarExpandedWidth="250px">
        <div className='appMainContainer'>
          <AppRoutes />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
