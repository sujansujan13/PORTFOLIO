"use client";
import React, { useState } from "react";
import {
  useGetCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/useCategory";
import { Plus, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

const COLOR_OPTIONS = [
  { value: "blue", label: "Blue", bg: "bg-blue-500" },
  { value: "rose", label: "Rose", bg: "bg-rose-500" },
  { value: "amber", label: "Amber", bg: "bg-amber-500" },
  { value: "emerald", label: "Emerald", bg: "bg-emerald-500" },
  { value: "purple", label: "Purple", bg: "bg-purple-500" },
  { value: "cyan", label: "Cyan", bg: "bg-cyan-500" },
];

export default function CategoryManagerPage() {
  const [activeTab, setActiveTab] = useState<"blog" | "project">("blog");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("blue");

  const categoriesQuery = useGetCategories({ type: activeTab });
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    createCategory.mutate(
      { name, slug: slug.toLowerCase().trim(), type: activeTab, color },
      {
        onSuccess: () => {
          toast.success("Category created!");
          setName("");
          setSlug("");
          setColor("blue");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(
      { id },
      {
        onSuccess: () => toast.success("Category deleted"),
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Category Manager</h1>
          <p className="text-sm text-muted-foreground">
            Manage dynamic categories for blogs and projects
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-md">
          <button
            onClick={() => setActiveTab("blog")}
            className={`px-4 py-1.5 text-xs font-bold rounded-sm ${activeTab === "blog" ? "bg-background shadow" : ""}`}
          >
            Blog Categories
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`px-4 py-1.5 text-xs font-bold rounded-sm ${activeTab === "project" ? "bg-background shadow" : ""}`}
          >
            Project Categories
          </button>
        </div>
      </div>

      {/* Create Form */}
      <form
        onSubmit={handleCreate}
        className="flex flex-wrap gap-3 bg-card border border-border p-4 rounded-md items-center"
      >
        <input
          type="text"
          placeholder="Category Name (e.g. React.js)"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
          }}
          className="flex-1 min-w-45 bg-background border border-border px-3 py-2 text-sm rounded-sm"
        />
        <input
          type="text"
          placeholder="Slug (e.g. react-js)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="flex-1 min-w-45 bg-background border border-border px-3 py-2 text-sm rounded-sm"
        />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="bg-background border border-border px-3 py-2 text-sm rounded-sm cursor-pointer"
        >
          {COLOR_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={createCategory.isPending}
          className="bg-primary text-primary-foreground px-4 py-2 text-sm font-bold rounded-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {/* List Table */}
      <div className="border border-border rounded-md overflow-hidden bg-card">
        {categoriesQuery.isPending ? (
          <p className="p-4 text-sm text-muted-foreground">
            Loading categories...
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Slug</th>
                <th className="p-3">Type</th>
                <th className="p-3">Badge Color</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoriesQuery.data?.map((cat) => {
                const colorTheme =
                  COLOR_OPTIONS.find((c) => c.value === cat.color) ??
                  COLOR_OPTIONS[0];

                return (
                  <tr
                    key={cat.id}
                    className="border-b border-border hover:bg-muted/40"
                  >
                    <td className="p-3 font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" /> {cat.name}
                    </td>
                    <td className="p-3 text-muted-foreground">{cat.slug}</td>
                    <td className="p-3 capitalize">{cat.type}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-border bg-muted">
                        <span
                          className={`w-2 h-2 rounded-full ${colorTheme.bg}`}
                        />
                        {colorTheme.label}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
