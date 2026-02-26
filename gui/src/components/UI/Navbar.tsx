import LogoWhite from '/logo_white_notext.svg'
import {Link} from "@tanstack/react-router";
import {useAuth} from "../../hooks/useAuth.ts";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-turquoise-500 px-2 w-full h-20 z-50 flex items-center justify-between">
      <div className={'flex items-center'}>
        <img src={LogoWhite} alt={'logo-white'} className={'p-1 h-full'}/>
        <h1 className={'text-light-cyan-200 ml-4 font-display font-bold text-xl'}>MetaRoboLearn</h1>
      </div>
      <div className="flex items-center gap-3 pr-4 font-display">
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <div className="p-2 flex gap-2">
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
            <Link to="/admin/users" className="[&.active]:font-bold">
              Users
            </Link>
            <Link to="/admin/activities" className="[&.active]:font-bold">
              Activities
            </Link>
            <Link to="/admin/tasks" className="[&.active]:font-bold">
              Tasks
            </Link>
          </div>
        )}
        {user && (
          <>
            <div className="flex items-center gap-2">
              <span className="font-bold text-light-cyan-100">
                {user.first_name} {user.last_name}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide rounded-full bg-sunglow-500 text-dark-neutrals-500">
                {user.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm bg-turquoise-600 text-light-cyan-200 rounded hover:bg-turquoise-700 transition"
            >
              Odjavi se
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;