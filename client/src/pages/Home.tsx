import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">How do you want to use NotesHub?</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
      "Customize your NotesHub experience based on your role."
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Share Notes Card */}
        <Card className="w-80 hover:shadow-xl transition-shadow cursor-pointer p-4" onClick={() => navigate("/login")}>  
          <CardHeader>
            <CardTitle>📤 I'm here to share notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your study materials and help others.
            </p>
            <Button className="mt-4 w-full" onClick={() => navigate("/login")}>Start</Button>
          </CardContent>
        </Card>

        {/* Access Notes Card */}
        <Card className="w-80 hover:shadow-xl transition-shadow cursor-pointer p-4" onClick={() => navigate("/access")}>  
          <CardHeader>
            <CardTitle>📥 I'm here to access notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300">
              Find and download study materials.
            </p>
            <Button className="mt-4 w-full" onClick={() => navigate("/access")}>Start</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}