const FilterButton = ({ time }) => {
  return (
    <>
      <div className="bg-neutral-100 rounded-lg shadow-md flex items-center">
        <div className="p-2">{time}</div>
      </div>
    </>
  );
};
export default FilterButton;
