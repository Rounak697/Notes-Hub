import { BookOpen, Menu, Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useNavigate } from "react-router-dom"

export default function NavbarAccessor() {
  const navigate = useNavigate()

  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <div onClick={()=>navigate("/access")} className="flex cursor-pointer items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5 text-yellow-500" />
          NotesHub
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Previous Year Papers (visible on md+) */}
          {/* <Button
            variant="ghost"
            onClick={() => navigate("/previous-papers")}
            className="hidden md:flex"
          >
            📄 Previous Year Papers
          </Button> */}

          {/* Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/search")}
            className="hover:bg-muted"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Hamburger menu on all screens */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-6 flex flex-col gap-4">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigate("/previous-papers")}
                >
                  📄 Previous Year Papers
                </Button>
                <div className="border-t pt-4">
                  <ModeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
