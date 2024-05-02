import { navBarItems } from '@/lib/constants/nav-bar-items';
import DesktopNavBar from './DesktopNavBar';
import MovileNavBar from './MovileNavBar';

function NavBar() {
    return (
        <>
            <DesktopNavBar navBarItems={navBarItems} />
            <MovileNavBar navBarItems={navBarItems} />
        </>
    );
}

export default NavBar;
