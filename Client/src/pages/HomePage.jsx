const HomePage = () => {
  return (
    <div className="flex justify-center min-h-screen items-start pt-40">
      <div className="max-w-md w-full bg-white p-5 rounded-2xl shadow text-gray-800 text-center mx-4 font-vazir">
        <h1 className="text-3xl font-extrabold mb-6 text-blue-700 flex flex-row-reverse items-center gap-2 justify-center">
          <span>🎲</span>
          <span>خوش آمدید!</span>
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          برای ورود به بازی از منوی زیر ابتدا ثبت‌نام کنید یا وارد شوید.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
