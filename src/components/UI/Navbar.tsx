import LogoWhite from '../../../public/logo_white_notext.svg'

const Navbar = () => {
  return (
    <div className="bg-turquoise-500 px-2 w-full h-20 z-50 flex items-center">
      <img src={LogoWhite} alt={'logo-white'} className={'p-1 h-full'}/>
      <h1 className={'text-light-cyan-200 ml-4 font-display font-bold text-xl'}>MetaRoboLearn</h1>
    </div>
  );
};

export default Navbar;