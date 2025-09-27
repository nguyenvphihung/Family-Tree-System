import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Users, Shield, History, Heart } from "lucide-react";
import { introduceImage, mapImage } from "@/assets/avatars";


// Custom Arrow SVG Component
const CustomArrowIcon = ({ className = "w-5 h-5", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 640 640"
    className={className}
    fill="currentColor"
    {...props}
  >
    <path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z" />
  </svg>
);

const Home = () => {
  // Smooth scroll function
  ;

  return (
    <div className="w-full relative min-h-screen" style={{
      background: 'linear-gradient(to right, #FFF1D2, #D0D6FF)',
      fontFamily: 'Roboto, sans-serif'
    }}>
      {/* Map Background Overlay - positioned below gradient */}
      <div className="fixed inset-0 z-0">
        <img
          src={mapImage}
          alt="Map Background"
          className="w-full h-full object-cover opacity-1500"
        />
      </div>

      {/* HomePage Hero Section */}
      <div className="h-screen relative z-10">
        {/* Top Navbar Overlay */}
        <header className="absolute top-0 inset-x-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="relative flex items-center justify-between">
              {/* Brand */}
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800 drop-shadow">Hệ thống cây gia phả gia đình</span>
              </div>
              {/* Centered title overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-800 drop-shadow text-center">
                  <span className="block">Bắt đầu</span>
                  <span className="block">kết nối các thế hệ</span>
                </span>
              </div>

              {/* Nav actions (max 4) */}
              <nav className="flex items-center gap-2 sm:gap-3 bg-white/30 backdrop-blur-md rounded-full px-2 py-1 shadow-lg">
                <Link to="/about">
                  <Button variant="ghost" className="text-gray-800 hover:text-gray-900 hover:bg-white/30 px-4">Giới thiệu</Button>
                </Link>
                <Link to="/family-tree-demo">
                  <Button variant="ghost" className="text-gray-800 hover:text-gray-900 hover:bg-white/30 px-4">Demo</Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="border-gray-600 text-gray-800 hover:bg-white/30 px-4">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button variant="ghost" className="border-gray-600 text-gray-800 hover:bg-white/30 px-4">Đăng ký</Button>
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Introduce Image with Overlay Content - fullscreen */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full mx-auto flex items-center justify-center">
            <img
              src={introduceImage}
              alt="Family Tree Introduction"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Text and Buttons Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-6xl w-full px-2">
              {/* Left Section - Build Family History */}
              <div className="text-center">
                <h3 className="text-2xl lg:text-3xl font-bold text-black drop-shadow mb-6 leading-tight">
                  <span className="block">Xây dựng</span>
                  <span className="block">lịch sử gia phả</span>
                </h3>

                <div className="mb-[150px] lg:mt-[-14px]">
                  <Link to="/register">
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Bắt đầu ngay
                      <CustomArrowIcon className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Section - AI Photo Restoration */}
              <div className="text-center">
                <h3 className="text-2xl lg:text-1xl font-bold text-black drop-shadow mb-6 leading-tight">
                  <span className="block">Phục chế ảnh</span>
                  <span className="block">nhờ công nghệ AI</span>
                </h3>

                <div className="mb-[150px] lg:mt-[-14px] ">
                  <Link to="/register">
                    <Button className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-4 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Bắt đầu ngay
                      <CustomArrowIcon className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* Introduction Section - Scrollable Content with same background */}
      <section id="introduction-section" className="relative z-10 py-16">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Về Hệ Thống Cây Gia Phả
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Một nền tảng hiện đại giúp bạn xây dựng, quản lý và chia sẻ lịch sử gia đình một cách dễ dàng và trực quan.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quản lý thành viên</h3>
              <p className="text-gray-700">Dễ dàng thêm, chỉnh sửa thông tin các thành viên trong gia đình</p>
            </div>

            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lưu trữ lịch sử</h3>
              <p className="text-gray-700">Ghi lại và bảo tồn những câu chuyện, kỷ niệm của gia đình</p>
            </div>

            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bảo mật cao</h3>
              <p className="text-gray-700">Thông tin gia đình được bảo vệ an toàn với công nghệ mã hóa</p>
            </div>

            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kết nối gia đình</h3>
              <p className="text-gray-700">Tạo cầu nối giữa các thế hệ và tăng cường tình cảm gia đình</p>
            </div>
          </div>

          {/* About Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tại sao chọn hệ thống của chúng tôi?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Giao diện trực quan</h4>
                    <p className="text-gray-700">Thiết kế hiện đại, dễ sử dụng cho mọi lứa tuổi</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Công nghệ AI</h4>
                    <p className="text-gray-700">Phục chế ảnh cũ và tự động phân tích thông tin</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Chia sẻ dễ dàng</h4>
                    <p className="text-gray-700">Chia sẻ cây gia phả với người thân một cách an toàn</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Bắt đầu ngay hôm nay</h4>
              <p className="text-gray-700 mb-6">
                Tham gia cùng hàng nghìn gia đình đã tin tưởng sử dụng hệ thống của chúng tôi để xây dựng và bảo tồn lịch sử gia đình.
              </p>
              <div className="space-y-3">
                <Link to="/register">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    Tạo tài khoản miễn phí
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/family-tree-demo">
                  <Button variant="outline" className="w-full border-gray-400 bg-white/70 hover:bg-white/90 shadow-md">
                    Xem demo trước
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-300/50">
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-700 font-medium">Gia đình tin tưởng</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">10000+</div>
              <div className="text-gray-700 font-medium">Thành viên được quản lý</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">5000+</div>
              <div className="text-gray-700 font-medium">Ảnh được phục chế</div>
            </div>
            <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-lg shadow-md">
              <div className="text-3xl font-bold text-red-600 mb-2">99%</div>
              <div className="text-gray-700 font-medium">Độ hài lòng</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;





