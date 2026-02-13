import LogoWhite from '/logo_white_notext.svg'
import {Link} from "@tanstack/react-router";

const Navbar = () => {
  return (
    <div className="bg-turquoise-500 px-2 w-full h-20 z-50 flex items-center">
      <img src={LogoWhite} alt={'logo-white'} className={'p-1 h-full'}/>
      <h1 className={'text-light-cyan-200 ml-4 font-display font-bold text-xl'}>MetaRoboLearn</h1>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
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
    </div>
  );
};

export default Navbar;