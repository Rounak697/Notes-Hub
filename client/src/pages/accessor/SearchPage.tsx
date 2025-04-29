import React, { useState } from 'react';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Note {
  _id: string;
  subject: string;
  department: string;
  semester: number;
  year: number;
  averageRating?: number;
  fileUrl: string;
  uploaderName: string;  // Added uploaderName
}

const SearchPage: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    try {
      const response = await api.get(`/notes/search?subject=${subject}`);
      setNotes(response.data.notes);
      setError('');
    } catch (error) {
      setError('Failed to fetch notes. Please try again later.');
      setNotes([]); // Clear notes on error
    }
  };

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
        toast.success("Thanks for rating !!");
        ratedNotes.push(noteId);
        localStorage.setItem("ratedNotes", JSON.stringify(ratedNotes));
        handleSearch(); // Refresh notes after rating
      }
    } catch (err) {
      toast.error("Failed to rate note");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter correct and full subject name"
          className="p-3 w-full sm:w-1/2 border border-violet-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <Button
          onClick={handleSearch}
          className="ml-3 bg-violet-600 hover:bg-violet-700 text-white py-3 px-5 rounded-md"
        >
          Search
        </Button>
      </div>

      {/* Error or No Notes Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!error && notes.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-10 text-lg">
          No notes found. Please try a different subject.
        </p>
      )}

      {/* Displaying Notes */}
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
                    if (
                      ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(fileExtension || "")
                    ) {
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

              {/* Uploader Name */}
              <p className="text-xs text-right text-muted-foreground italic">
                    ~{note.uploaderName || "Unknown"}
                  </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
