import { navBarItems } from '@/constant/nav-bar-items';
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
