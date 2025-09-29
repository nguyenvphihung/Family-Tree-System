import { Search, Bell, User, Menu, TreePine } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function HeaderNav() {
  return (
    <header className="h-16 bg-[#2E2E2E] border-b border-[#E6E6EA] flex items-center justify-between px-6">
      {/* Logo và Navigation */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <TreePine className="w-8 h-8 text-white" />
          <span className="text-white font-semibold text-xl">Gia Phả</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Cây gia đình
          </a>
          <a href="#" className="text-[#FF4D73] font-medium">
            Bản đồ mộ phần
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Tài liệu
          </a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Sự kiện
          </a>
        </nav>
      </div>

      {/* Search và User */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Tìm kiếm..." 
            className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
          <Bell className="w-5 h-5" />
        </Button>
        
        <Avatar className="w-8 h-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-[#FF4D73] text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>

        <Button variant="ghost" size="icon" className="md:hidden text-gray-300">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}