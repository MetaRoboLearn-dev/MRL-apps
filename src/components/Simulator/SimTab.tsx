interface Props {
  active: boolean;
}

const SimTab = ({ active }: Props) => {
  const style =
    active ?  ('bg-turquoise-700 text-white font-bold py-3') :
      ('bg-turquoise-50 text-dark-neutrals-200 py-2 hover:cursor-pointer hover:bg-turquoise-100 hover:py-3 transition');

  return (
    <div className={`${style} font-display mx-1 px-4 rounded-t-lg`}>
      Simulacija #
    </div>
  );
};

export default SimTab;