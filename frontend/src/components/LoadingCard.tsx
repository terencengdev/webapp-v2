export default function LoadingCard() {
  return (
    <div className="loading-card bg-[#fff] p-4 contact-card border-b-[6px] border-[#b0b0b0]">
      <div className="flex items-center gap-5">
        <div className="left h-[auto] flex-[0_0_28%] w-[28%]">
          <img className="h-[150px]  md:h-[10vw] w-[100%] bg-[#cccccc]"></img>
        </div>
        <div className="right flex-2 flex flex-col gap-3">
          <div className="name w-[80%]  bg-[#cccccc] h-[10px]"></div>
          <div className="email w-[80%]  bg-[#cccccc] h-[10px]"></div>
          <div className="phone w-[80%]  bg-[#cccccc] h-[10px]"></div>
          <div className="address w-[80%]  bg-[#cccccc] h-[10px]"></div>
        </div>
      </div>
    </div>
  );
}
