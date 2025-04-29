import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "./Navbar";
import { useState } from "react";

const UploadSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  department: z.string().min(1, "Department is required"),
  year: z.string().min(1, "Year is required"),
  file: z.any().refine((value) => value !== null, {
    message: "File is required",
  }),
});

export default function uploadpapers() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      subject: "",
      department: "",
      year: "",
      file: null,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("subject", data.subject);
      formData.append("department", data.department);
      formData.append("year", data.year);
      formData.append("file", data.file);

      const res = await api.post("/notes/uploadpaper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (res.status === 201) {
        toast.success( res.data.message+"🚀");
        form.reset();
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error?.response?.data?.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-6 text-center">Upload Previous Year Papers </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 bg-muted p-6 rounded-lg shadow"
          >
            {/* Subject Field */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department Field */}
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
                        {["CSE", "AIML", "AIDS", "ECE", "ME"].map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year Field (Now a text input) */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>month & year</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter month & year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Field */}
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

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
