"use client";

import { usePostTask } from "@/hooks/usePostTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PostTaskPage() {
  const {
    form,
    onSubmit,
    categories,
    isLoadingCategories,
    isSubmitting,
  } = usePostTask();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Task</CardTitle>
          <CardDescription>Describe what you need done and receive bids.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" placeholder="e.g. Help moving furniture" {...form.register("title")} />
              {form.formState.errors.title && <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("category")}
                disabled={isLoadingCategories}
              >
                <option value="">{isLoadingCategories ? "Loading categories..." : "Select a category"}</option>
                {categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))
                ) : !isLoadingCategories && (
                   <option value="" disabled>No categories available</option>
                )}
              </select>
              {form.formState.errors.category && <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label htmlFor="budget">Budget (₦)</Label>
                <Input id="budget" type="number" placeholder="5000" {...form.register("budget")} />
                {form.formState.errors.budget && <p className="text-red-500 text-sm">{form.formState.errors.budget.message}</p>}
                </div>

                <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" {...form.register("deadline")} />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
               <Input id="location" placeholder="e.g. Lagos, or Remote" {...form.register("location")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Provide detailed instructions..." 
                className="min-h-[150px]"
                {...form.register("description")}
              />
              {form.formState.errors.description && <p className="text-red-500 text-sm">{form.formState.errors.description.message}</p>}
            </div>

            <Button className="w-full bg-[#6B46C1] hover:bg-[#553C9A] py-6 text-lg" disabled={isSubmitting}>
              {isSubmitting ? "Posting Task..." : "Post Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
