const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0B5394]">Lastik.co</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 text-sm">Lastik Yönetim Sistemi</span>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {currentYear} Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
