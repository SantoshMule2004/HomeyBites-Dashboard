
import './Style.css';
import logo from '../assets/homeybites-logo.png'
import { Link } from 'react-router-dom';
import { useUserInfo } from '../Context/UserContext';

export const NavBar = ({ onToggleSidebar }) => {

    const { getUserInfo, doLogout, isLoggedIn } = useUserInfo();

    const isAdmin = localStorage.getItem("AdminLogin");

    const logOut = () => {
        doLogout(() => {
            setLogin(false);
            navigate('/');
        });
    };

    const user = getUserInfo();

    return (
        <nav className="navbar navbar-white fixed-top navbar-expand-lg bg-white px-5">
            <div className="container-fluid">
                <div className="d-flex justify-content-start">
                    <div className="d-flex align-items-center me-3">
                        <i className="fa-solid fa-bars menuBar" onClick={onToggleSidebar}></i>
                    </div>
                    <Link to={`${isAdmin ? '/admin-dashboard' : '/dashboard'}`} className="d-flex text-decoration-none mt-1 align-items-center text-dark">
                        <span className='fs-4 d-sm-inline'><img className='Logo' src={logo} alt='Logo'></img></span>
                    </Link>
                </div>
                <div className="d-flex justify-content-end">
                    {/* <a href="#" className="Login p-2">Login</a> */}
                    {/* {
                        isLoggedIn() && (
                            <i className="fa-solid fa-circle-user fs-3"></i>
                        )
                    } */}

                    {
                        isLoggedIn() && (
                            <>
                                <div className="dropdown">
                                    <button className="nav-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i className="fa-solid fa-circle-user"></i> {user.firstName + " " + user.lastName}
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="dropdownMenuButton1">
                                        <li><Link to='/profile' className='dropdown-item custom-item' >Profile</Link></li>
                                        {/* <li><Link to='/' className='dropdown-item' onClick={logOut}>Logout</Link></li> */}
                                        <li><Link to='/' className='dropdown-item custom-item' onClick={logOut}>Logout</Link></li>
                                    </ul>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </nav>
    )
}
