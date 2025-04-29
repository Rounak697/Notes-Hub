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


export default function PreviousYearPapers() {
    const [branch, setBranch] = useState("")
    const [year, setYear] = useState("")  // year remains a string
    const [papers, setPapers] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const fetchPapers = async () => {
        if (!branch || !year) {
            toast.warning("Please select both Branch and Year!")
            return
        }

        setLoading(true)
        try {
            const res = await api.post("/notes/previous-papers", { branch, year })
            setPapers(res.data.papers)
        } catch (err) {
            console.error("Failed to fetch papers", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <NavbarAccessor />

            {/* Hero Section */}
            <section className="py-8 bg-background border-b">
                <div className="container mx-auto text-center space-y-1">
                    <h1 className="text-3xl font-bold text-violet-600 dark:text-violet-400">
                        📄 Previous Year Papers
                    </h1>
                    <p className="text-muted-foreground">
                        Choose your branch and year to view past exam papers
                    </p>
                </div>
            </section>

            {/* Filters */}
            <div className="container mx-auto px-4 mt-6 flex flex-wrap gap-4 justify-center">
                <Select onValueChange={setBranch}>
                    <SelectTrigger className="w-[130px] text-sm">
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

                {/* Year Input */}
                <div className=" text-sm">
                    <input
                        type="text"
                        placeholder="Enter subject"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full p-2 border border-violet-300 dark:border-violet-800 rounded-xl"
                    />
                </div>

                <Button
                    onClick={fetchPapers}
                    className="bg-violet-600 text-white hover:bg-violet-700 transition px-5 py-2 text-sm rounded-xl"
                >
                    Search
                </Button>
            </div>

            {/* Papers List */}
            <div className="container mx-auto px-4 mt-10 pb-10">
                {loading ? (
                    <div className="flex justify-center mt-10">
                        <Loader className="animate-spin text-violet-500" />
                    </div>
                ) : papers.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                        No papers found. Try changing filters 📘
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {papers.map((paper) => (
                            <Card
                                key={paper._id}
                                className="shadow-md border border-violet-300 dark:border-violet-800 hover:shadow-xl transition rounded-2xl"
                            >
                                <CardContent className="p-5 space-y-3">
                                    <h3 className="text-lg font-semibold text-violet-700 dark:text-violet-300">
                                        {paper.subject}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {paper.department} - {paper.year}
                                    </p>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="outline"
                                            className="w-[48%] text-violet-600 border-violet-400 dark:text-violet-300 dark:border-violet-700"
                                            onClick={() => {
                                                const fileUrl = paper.fileUrl;
                                                const fileExtension = fileUrl.split(".").pop()?.toLowerCase();

                                                let viewerUrl = fileUrl; // default: open directly

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
                                                const downloadUrl = paper.fileUrl.replace("/upload/", "/upload/fl_attachment/")
                                                const link = document.createElement("a")
                                                link.href = downloadUrl
                                                link.setAttribute("download", "previous-year-paper")
                                                document.body.appendChild(link)
                                                link.click()
                                                document.body.removeChild(link)
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
