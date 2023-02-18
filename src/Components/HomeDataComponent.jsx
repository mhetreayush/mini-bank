const HomeDataComponent = ({ arr }) => {
  const len = arr.length;
  const width = `calc(100% / ${len})`;
  return (
    <div className="flex gap-x-5 gap-y-4">
      {arr.map((item, idx) => {
        return (
          <div
            className="bg-primaryGray rounded-md p-4"
            style={{ width }}
            key={idx}
          >
            <div className="text-gray-400">{item.name}:</div>
            <div className="text-white text-4xl">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
};

export default HomeDataComponent;
