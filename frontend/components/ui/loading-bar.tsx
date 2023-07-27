export const LoadingBar: React.FC = () => (
  <>
    <div className="fixed top-0 h-screen w-screen overflow-hidden bg-black/80">
      <div className="absolute top-0 h-[2.75px] w-full rounded-none bg-slate-100/10">
        <div className="progress-sliding bg-blue-400"></div>
      </div>
    </div>
  </>
);
