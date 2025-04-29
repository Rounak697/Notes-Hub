import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "./Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Correct for React apps

const UploadSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  department: z.string().min(1, "Department is required"),
  semester: z.string().min(1, "Semester is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().optional(),
  file: z.any().refine((value) => value !== null, {
    message: "File is required",
  }),
});

export default function Upload() {
  const navigate = useNavigate(); // ✅ React Router hook
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      subject: "",
      department: "",
      semester: "",
      year: "",
      description: "",
      file: null,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("department", data.department);
      formData.append("semester", data.semester);
      formData.append("year", data.year);
      formData.append("description", data.description || "");
      formData.append("file", data.file);

      const res = await api.post("/notes/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (res.status === 201) {
        toast.success("Notes uploaded successfully 🚀");
        form.reset();
      } else {
        toast.error("Something went wrong while uploading ❌");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Upload failed");
      setLoading(false);
    }
  };

  const handleRedirectToPapers = () => {
    navigate("/uploadpapers");
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Upload Notes</h1>

        {/* Redirect Button */}
        <div className="flex justify-center mb-6">
          <Button variant="outline" onClick={handleRedirectToPapers}>
            Upload Previous Year Papers 
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-muted p-6 rounded-lg shadow"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter correct and full subject name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {["CSE", "AIML", "AIDS", "ECE", "ME"].map(
                          (department) => (
                            <SelectItem key={department} value={department}>
                              {department}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {["1st", "2nd", "3rd", "4th"].map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="semester"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 8 }, (_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the notes (optional)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Notes File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
