import { useState } from "react"
import NavbarAccessor from "./Navbar"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

export default function NotesAccessor() {
  const [branch, setBranch] = useState("")
  const [semester, setSemester] = useState("")
  const [year, setYear] = useState("")
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [ratingSuccess, setRatingSuccess] = useState(false)

  const fetchNotes = async () => {
    setLoading(true)
    if (!year || !semester || !branch) {
      setLoading(false)
      toast.success("Please choose all the fields!")
      return
    }
    try {
      const res = await api.post("/notes", {
        branch,
        semester,
        year,
      })
      setNotes(res.data.notes)
    } catch (err) {
      console.error("Failed to fetch notes", err)
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (noteId: string, rating: number) => {
    const ratedNotes = JSON.parse(localStorage.getItem("ratedNotes") || "[]");

    if (ratedNotes.includes(noteId)) {
      toast.success("You've already rated this note!");
      return;
    }

    try {
      const res = await api.post("/notes/rate", {
        noteId,
        rating,
      });
      if (res.data.success) {
        setRatingSuccess(true);
        ratedNotes.push(noteId);
        localStorage.setItem("ratedNotes", JSON.stringify(ratedNotes));
      }
      setTimeout(() => setRatingSuccess(false), 3000);

      fetchNotes();
    } catch (err) {
      console.error("Failed to rate note", err);
    }
  };
  
  

  return (
    <>
      <NavbarAccessor />

      <section className="py-8 bg-background border-b">
        <div className="container mx-auto text-center space-y-1">
          <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
            📚 Explore Notes
          </h1>
          <p className="text-muted-foreground">
            Filter your branch, year & semester to find the best notes
          </p>
        </div>
      </section>

      {/* Filter Controls */}
      <div className="container mx-auto px-4 mt-6 flex flex-wrap gap-3 justify-center items-center">
        <Select onValueChange={setBranch}>
          <SelectTrigger className="w-[120px] text-sm">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CSE">CSE</SelectItem>
            <SelectItem value="AIML">AIML</SelectItem>
            <SelectItem value="AIDS">AIDS</SelectItem>
            <SelectItem value="ECE">ECE</SelectItem>
            <SelectItem value="ME">ME</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setYear}>
          <SelectTrigger className="w-[110px] text-sm">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1st">1st</SelectItem>
            <SelectItem value="2nd">2nd</SelectItem>
            <SelectItem value="3rd">3rd</SelectItem>
            <SelectItem value="4th">4th</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setSemester}>
          <SelectTrigger className="w-[130px] text-sm">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="6">6</SelectItem>
            <SelectItem value="7">7</SelectItem>
            <SelectItem value="8">8</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={fetchNotes}
          className="bg-violet-600 text-white hover:bg-violet-700 transition px-5 py-2 text-sm rounded-xl"
        >
          Search
        </Button>
      </div>

      {/* Rating Success Message */}
      {ratingSuccess && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
          Thank you for your rating! 🎉
        </div>
      )}

      {/* Notes List */}
      <div className="container mx-auto px-4 mt-10 pb-10">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader className="animate-spin text-violet-500" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No notes found. Try searching 🎯
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="shadow-md border border-violet-300 dark:border-violet-800 hover:shadow-xl transition rounded-2xl"
              >
                <CardContent className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                    {note.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {note.department} - Semester {note.semester} ({note.year})
                  </p>
                  <p className="text-sm text-yellow-600 font-medium">
                    {note.averageRating?.toFixed(1) || "N/A"}⭐
                  </p>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="w-[48%] text-violet-600 border-violet-400 dark:text-violet-300 dark:border-violet-700"
                      onClick={() => {
                        const fileUrl = note.fileUrl;
                        const fileExtension = fileUrl.split(".").pop()?.toLowerCase();

                        let viewerUrl = fileUrl;

                        if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(fileExtension || "")) {
                          viewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
                        }

                        window.open(viewerUrl, "_blank");
                      }}
                    >
                      View
                    </Button>

                    <Button
                      className="w-[48%] bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => {
                        const downloadUrl = note.fileUrl.replace('/upload/', '/upload/fl_attachment/');
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.setAttribute('download', 'note-file');
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      Download
                    </Button>
                  </div>

                  {/* Rating System */}
                  <div className="mt-4 text-center">
                    <h4 className="text-sm text-muted-foreground mb-2">Rate this note:</h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          onClick={() => handleRating(note._id, rating)}
                          className="text-sm border border-gray-300 hover:border-gray-500 px-3 py-1"
                        >
                          {rating} ★
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Author at Bottom */}
                  <p className="text-xs text-right text-muted-foreground italic">
                    ~{note.uploaderInfo.name || "Unknown"}
                  </p>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
