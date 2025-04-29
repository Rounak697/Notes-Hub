import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Replace with real auth state
  const navigate = useNavigate()
  const { logout } = useAuth();
  

  const handleLogout = async () => {
    try {
     const res =  await api.post("/auth/logout"); // call backend to clear cookie
      setIsLoggedIn(false);
      if(res.data.success){
        console.log(res.data);
         logout();
        
        toast.success("Logged out successfully!");
        navigate("/login");
      }
      else{
        toast.error("Something went wrong!!");
      }
    
    } catch (err) {
      toast.error("Logout failed!");
      console.error(err);
    }
  };

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `hover:underline hover:text-orange-600 ${isActive ? "font-bold  text-primary" : ""}`

  return (
    <nav className="w-full px-4 py-3 border-b bg-background">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        
        <Link to="/dashboard" className="text-xl font-semibold tracking-wide">
          NotesHub 📤
        </Link>

        
        <div className="flex items-center gap-4">
          
          <NavLink  to="/upload" className={linkClasses}>
            Upload
          </NavLink>

         
          <ModeToggle />

         
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 mt-6">
                <div className="mt-6 border-t pt-4 flex flex-col gap-3">
                  {isLoggedIn && (
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
