const LoadingScreen = () => {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-600 flex items-center justify-center">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-8 opacity-20"></div>
  
        {/* Centered loading indicator */}
        <div className="relative flex flex-col items-center">
          {/* Spinner */}
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-pulse"></div>
            <div
              className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-500 rounded-full border-t-transparent 
              animate-spin"
            ></div>
          </div>
  
          {/* Loading text */}
          <h2 className="text-xl font-semibold text-white">กำลังเข้าสู่ระบบ</h2>
          <p className="text-teal-200 text-sm animate-pulse">กรุณารอสักครู่...</p>
        </div>
      </div>
    );
  };
  
  export default LoadingScreen;
  