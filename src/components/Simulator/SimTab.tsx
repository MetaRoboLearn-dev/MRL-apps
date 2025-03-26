interface Props {
  active: boolean;
}

const SimTab = ({ active }: Props) => {
  const style = active ?
    ('bg-turquoise-700 text-white font-bold py-2') :
    ('bg-turquoise-50 text-dark-neutrals-200 pt-2 pb-3.5 translate-y-2.5 hover:cursor-pointer hover:bg-turquoise-100 hover:translate-y-1.5 transition');

  return (
    <div className={`${style} font-display mx-1 px-4 rounded-t-lg`}>
      Simulacija #
    </div>
  );
};

export default SimTab;