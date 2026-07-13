import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Upload, Download, Trash2, Eye, Search, Plus, File, FileText, FileImage, HardDrive, Folder
} from "lucide-react";
import { toast } from "sonner";

export default function Documents() {
  const [documents, setDocuments] = useState([
    { id: 1, name: "School_Policy_2024.pdf", size: "2.4 MB", type: "pdf", owner: "Admin", uploadedDate: "2024-01-15", category: "Policies" },
    { id: 2, name: "Academic_Calendar.xlsx", size: "1.1 MB", type: "excel", owner: "Registrar", uploadedDate: "2024-01-10", category: "Academic" },
    { id: 3, name: "Student_Handbook.pdf", size: "4.8 MB", type: "pdf", owner: "Admin", uploadedDate: "2024-01-05", category: "Academic" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadCategory, setUploadCategory] = useState("Academic");

  const categories = ["Academic", "Policies", "Finance", "Admissions", "Other"];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    const newDoc = {
      id: documents.length + 1,
      name: selectedFile.name,
      size: "1.2 MB",
      type: selectedFile.name.split(".").pop() || "file",
      owner: "Current User",
      uploadedDate: new Date().toISOString().split("T")[0],
      category: uploadCategory
    };
    setDocuments([...documents, newDoc]);
    toast.success("Document uploaded successfully");
    setShowUploadDialog(false);
    setSelectedFile(null);
  };

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document deleted");
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="h-4 w-4 text-red-500" />;
      case "excel": return <FileText className="h-4 w-4 text-green-500" />;
      case "word": return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Manage school documents and resources</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Add a new document to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-2">Select a document</p>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0])}
                  className="hidden"
                  id="file-input"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="w-full"
                >
                  Choose File
                </Button>
                {selectedFile && (
                  <p className="text-xs text-emerald-600 mt-2">✓ {selectedFile.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
              <Button onClick={handleUpload}>Upload</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <HardDrive className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Storage Used</p>
              <p className="text-lg font-bold">45.2 GB / 100 GB</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Files</p>
              <p className="text-lg font-bold">{documents.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
              <Folder className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Categories</p>
              <p className="text-lg font-bold">{categories.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-bold">Name</th>
                  <th className="text-left py-4 px-6 font-bold">Size</th>
                  <th className="text-left py-4 px-6 font-bold">Category</th>
                  <th className="text-left py-4 px-6 font-bold">Owner</th>
                  <th className="text-left py-4 px-6 font-bold">Date</th>
                  <th className="text-right py-4 px-6 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map(doc => (
                    <tr key={doc.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {getFileIcon(doc.type)}
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">{doc.size}</td>
                      <td className="py-4 px-6"><Badge className="bg-primary/10 text-primary">{doc.category}</Badge></td>
                      <td className="py-4 px-6">{doc.owner}</td>
                      <td className="py-4 px-6 text-muted-foreground">{doc.uploadedDate}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No documents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
