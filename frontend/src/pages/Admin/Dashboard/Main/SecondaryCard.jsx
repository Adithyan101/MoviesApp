const SecondaryCard = ({ pill, content, info, gradient }) => {
  return (
    <div
      className={`w-[15rem] h-[12rem] relative mt-10 bg-gradient-to-b ${gradient} rounded-2xl shadow-xl ml-5`}
    >
      {/* Pill */}
      <div
        className={`absolute -top-5 left-1/2 -translate-x-1/2 border border-white bg-gradient-to-b ${gradient} rounded-full py-1.5 px-6 text-sm text-white font-medium shadow-md`}
      >
        {pill}
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-4 text-center">
        <h2 className="text-4xl font-extrabold text-white tracking-wide leading-tight drop-shadow-md">
          {content}
        </h2>
      </div>

      {/* Info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-200 font-light">
        {info}
      </div>
    </div>
  );
};

export default SecondaryCard;
