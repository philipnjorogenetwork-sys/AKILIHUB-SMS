import { useState, useMemo } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, Search, Filter, Plus, FileText, User, Users,
  GraduationCap, Paperclip, ClipboardList, CheckCircle2, 
  Clock, AlertCircle, Eye, Edit, MoreHorizontal, Import,
  UserCheck, X
} from "lucide-react";
import { admissionApplications as initialApps, type AdmissionApplication } from "@/data/schoolData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Constants for Pipeline Stages
const PIPELINE_STAGES = [
  { id: "application", label: "Application", color: "bg-orange-500" },
  { id: "interview", label: "Interview", color: "bg-amber-500" },
  { id: "decision", label: "Decision", color: "bg-orange-600" },
  { id: "enrollment", label: "Enrollment", color: "bg-emerald-500" },
];

export default function AdmissionsPage() {
  const [apps, setApps] = useState<AdmissionApplication[]>(initialApps);
  const [filterStage, setFilterStage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState<AdmissionApplication | null>(null);

  // Statistics for Overview Cards
  const stats = useMemo(() => {
    return {
      application: apps.filter(a => a.status === "review").length,
      interview: apps.filter(a => a.status === "interview").length,
      decision: apps.filter(a => a.status === "pending").length,
      enrollment: apps.filter(a => a.status === "approved").length,
      total: apps.length
    };
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           app.parentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterStage) {
        if (filterStage === "application") return matchesSearch && app.status === "review";
        if (filterStage === "interview") return matchesSearch && app.status === "interview";
        if (filterStage === "decision") return matchesSearch && app.status === "pending";
        if (filterStage === "enrollment") return matchesSearch && app.status === "approved";
      }
      return matchesSearch;
    });
  }, [apps, filterStage, searchQuery]);

  const handleNextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    { title: "Student Info", icon: User },
    { title: "Academics", icon: GraduationCap },
    { title: "Guardian", icon: Users },
    { title: "Documents", icon: Paperclip },
    { title: "Notes", icon: FileText },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-emerald-500 hover:bg-emerald-600">Enrolled</Badge>;
      case "review": return <Badge className="bg-orange-500 hover:bg-orange-600">Applied</Badge>;
      case "interview": return <Badge className="bg-amber-500 hover:bg-amber-600">Interview</Badge>;
      case "pending": return <Badge className="bg-orange-600 hover:bg-orange-700">Decision</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admissions Management</h1>
          <p className="text-muted-foreground">Manage the entire student recruitment and enrollment lifecycle.</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> New Admission Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>New Admission Application</DialogTitle>
              <DialogDescription>Fill in the student details to start the admission process.</DialogDescription>
            </DialogHeader>
            
            {/* Stepper Header */}
            <div className="flex justify-between items-center mb-8 px-4 relative">
              <div className="absolute top-[18px] left-0 right-0 h-0.5 bg-muted -z-10 mx-10" />
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-all ${currentStep > idx + 1 ? "bg-primary border-primary text-white" : currentStep === idx + 1 ? "bg-background border-primary text-primary shadow-md" : "bg-background border-muted text-muted-foreground"}`}>
                    {currentStep > idx + 1 ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] mt-2 font-medium ${currentStep === idx + 1 ? "text-primary" : "text-muted-foreground"}`}>{step.title}</span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[300px] py-4">
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date of Birth</label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender</label>
                    <select className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                   <div className="space-y-2">
                    <label className="text-sm font-medium">Target Grade</label>
                    <Input placeholder="e.g. Grade 9" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Previous School</label>
                    <Input placeholder="Enter school name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last GPA / Average</label>
                    <Input placeholder="e.g. 3.8" />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Guardian Name</label>
                    <Input placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Relationship</label>
                    <Input placeholder="Mother" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input placeholder="+254 700 000 000" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input placeholder="jane.doe@example.com" />
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                  <div className="border-2 border-dashed border-muted rounded-xl p-10 flex flex-col items-center justify-center text-center">
                    <Import className="h-10 w-10 text-muted-foreground mb-4" />
                    <h4 className="font-semibold">Import Student Records</h4>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">Upload student details from previous school or Excel sheets to populate automatically.</p>
                    <Button variant="outline" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <span className="text-sm">Birth Certificate</span>
                      <Button size="sm" variant="ghost">Upload</Button>
                    </div>
                    <div className="p-3 border rounded-lg flex items-center justify-between">
                      <span className="text-sm">Previous Report Form</span>
                      <Button size="sm" variant="ghost">Upload</Button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admission Notes</label>
                    <textarea 
                      className="w-full min-h-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Special requirements, interview notes, etc."
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="flex justify-between sm:justify-between items-center bg-muted/30 -mx-6 -mb-6 p-6 rounded-b-lg">
              <Button 
                variant="ghost" 
                onClick={handlePrevStep} 
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                {currentStep < 5 ? (
                  <Button onClick={handleNextStep}>Next</Button>
                ) : (
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsModalOpen(false)}>Complete Application</Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${!filterStage ? "ring-2 ring-primary bg-primary/5 shadow-sm" : ""}`}
          onClick={() => setFilterStage(null)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                <h3 className="text-2xl font-bold mt-1 text-foreground">{stats.total}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 ring-2 ring-slate-50">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
               <span className="text-emerald-500 font-medium flex items-center mr-1">
                 +12% <ChevronRight className="h-3 w-3 rotate-[-90deg]" />
               </span>
               vs last month
            </div>
          </CardContent>
        </Card>

        {PIPELINE_STAGES.map((stage) => (
          <Card 
            key={stage.id}
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${filterStage === stage.id ? "ring-2 ring-primary bg-primary/5 shadow-sm" : ""}`}
            onClick={() => setFilterStage(stage.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stage.label}</p>
                  <h3 className="text-2xl font-bold mt-1 text-foreground">{stats[stage.id as keyof typeof stats]}</h3>
                </div>
                <div className={`h-10 w-10 rounded-full ${stage.color} bg-opacity-10 flex items-center justify-center text-foreground ring-2 ring-opacity-20`}>
                  {stage.id === "application" && <FileText className={`h-5 w-5 ${stage.color.replace('bg-', 'text-')}`} />}
                  {stage.id === "interview" && <UserCheck className={`h-5 w-5 ${stage.color.replace('bg-', 'text-')}`} />}
                  {stage.id === "decision" && <AlertCircle className={`h-5 w-5 ${stage.color.replace('bg-', 'text-')}`} />}
                  {stage.id === "enrollment" && <CheckCircle2 className={`h-5 w-5 ${stage.color.replace('bg-', 'text-')}`} />}
                </div>
              </div>
              <div className="mt-4 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className={`${stage.color} h-full transition-all`} style={{ width: `${(stats[stage.id as keyof typeof stats] / stats.total) * 100}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Styled Progress Line (Procedure Overview) */}
      <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-r from-orange-50 to-emerald-50">
        <CardContent className="p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-orange-900 border-l-4 border-orange-500 pl-3">ADMISSION PROCEDURE OVERVIEW</h3>
              <Badge variant="outline" className="bg-white/50 border-orange-200 text-orange-800">Operational</Badge>
           </div>
           
           <div className="relative pt-2 pb-6">
              <div className="absolute top-[34px] left-0 right-0 h-1 bg-white/50 rounded-full" />
              <div className="absolute top-[34px] left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 via-orange-600 to-emerald-500 rounded-full opacity-60" />
              
              <div className="flex justify-between items-start relative z-10">
                {PIPELINE_STAGES.map((stage, idx) => (
                  <div key={stage.id} className="flex flex-col items-center group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${stage.color} text-white transition-transform group-hover:scale-110`}>
                      {idx + 1}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-xs font-bold text-gray-800">{stage.label.toUpperCase()}</p>
                      <p className="text-[10px] text-gray-500 mt-1 max-w-[80px]">Automated workflow</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Main List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List */}
        <div className={selectedApp ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students or parents..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <Import className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-border/50">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold">Student Name</TableHead>
                  <TableHead className="font-bold">Target Grade</TableHead>
                  <TableHead className="font-bold">Parent</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="font-bold">Progress</TableHead>
                  <TableHead className="font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <TableRow 
                      key={app.id} 
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedApp?.id === app.id ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
                      onClick={() => setSelectedApp(app)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-semibold text-primary">
                            {app.studentName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground leading-none">{app.studentName}</p>
                            <p className="text-xs text-muted-foreground mt-1">ID: APP-2024-{app.id.padStart(3, '0')}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{app.grade}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">{app.parentName}</p>
                          <p className="text-xs text-muted-foreground">Guardian</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(app.status)}
                      </TableCell>
                      <TableCell>
                        <div className="w-24 space-y-1.5">
                           <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>{app.progress}%</span>
                           </div>
                           <Progress value={app.progress} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                       No applications found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right Column: Detailed View */}
        {selectedApp && (
          <div className="lg:col-span-4 space-y-6 animate-in fade-in slide-in-from-right-4">
            <Card className="sticky top-24 border-border/50 overflow-hidden shadow-lg">
              <div className="bg-primary px-6 py-8 text-white relative">
                 <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                 >
                   <X className="h-4 w-4" />
                 </button>
                 <div className="flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/30 mb-4 shadow-xl">
                      {selectedApp.studentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h2 className="text-xl font-bold">{selectedApp.studentName}</h2>
                    <p className="text-primary-foreground/80 text-sm mt-1">Applying for {selectedApp.grade}</p>
                    <div className="mt-4 flex gap-2">
                       <Badge className="bg-white text-primary border-none hover:bg-white">{selectedApp.status.toUpperCase()}</Badge>
                       <Badge variant="outline" className="border-white/40 text-white">ID: {selectedApp.id}</Badge>
                    </div>
                 </div>
              </div>
              
              <CardContent className="p-0">
                 {/* Application Progress at Top */}
               <div className="p-6 border-b border-border/50 bg-orange-50/30">
                    <h4 className="text-[10px] font-bold text-orange-900 mb-4 tracking-widest uppercase">APPLICATION PROGRESS</h4>
                    <div className="flex justify-between items-center relative gap-2">
                       <div className="absolute top-3 left-0 right-0 h-0.5 bg-muted -z-1" />
                       {PIPELINE_STAGES.map((stage, idx) => {
                          const isActive = idx === (selectedApp.status === "approved" ? 3 : selectedApp.status === "interview" ? 1 : selectedApp.status === "review" ? 0 : 2);
                          const isDone = idx < (selectedApp.status === "approved" ? 4 : selectedApp.status === "interview" ? 2 : selectedApp.status === "review" ? 1 : 3);
                          
                          return (
                            <div key={stage.id} className="flex flex-col items-center relative z-10 w-full">
                               <div className={`h-6 w-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold transition-all ${isDone ? "bg-emerald-500 border-emerald-500 text-white" : isActive ? "bg-primary border-primary text-white scale-110 shadow-md" : "bg-white border-muted text-muted-foreground"}`}>
                                  {isDone ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                               </div>
                               <span className={`text-[8px] mt-2 font-bold whitespace-nowrap ${isActive ? "text-primary" : "text-muted-foreground"}`}>{stage.label}</span>
                            </div>
                          );
                       })}
                    </div>
                 </div>

                 <Tabs defaultValue="info" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 rounded-none bg-white border-b border-border/50 h-12">
                       <TabsTrigger value="info" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs">General</TabsTrigger>
                       <TabsTrigger value="academic" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs">Academic</TabsTrigger>
                       <TabsTrigger value="actions" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-xs">Timeline</TabsTrigger>
                    </TabsList>
                    
                    <div className="p-6">
                       <TabsContent value="info" className="space-y-4 m-0">
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Parent Name</p>
                                <p className="text-sm font-semibold">{selectedApp.parentName}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Date Applied</p>
                                <p className="text-sm font-semibold">{selectedApp.date}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Email</p>
                                <p className="text-sm font-semibold truncate">parent@example.com</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone</p>
                                <p className="text-sm font-semibold">+254 712 345 678</p>
                             </div>
                          </div>
                          
                          <div className="pt-4 border-t border-muted/50">
                             <h5 className="text-xs font-bold mb-3 flex items-center">
                                <Paperclip className="h-3 w-3 mr-2 text-primary" /> Submitted Documents
                             </h5>
                             <div className="space-y-2">
                                <div className="p-2 border rounded bg-slate-50 flex items-center justify-between text-xs">
                                   <span className="flex items-center"><FileText className="h-3 w-3 mr-2 text-blue-500" /> Birth_Certificate.pdf</span>
                                   <Eye className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary" />
                                </div>
                                <div className="p-2 border rounded bg-slate-50 flex items-center justify-between text-xs">
                                   <span className="flex items-center"><FileText className="h-3 w-3 mr-2 text-blue-500" /> Last_Report_Card.pdf</span>
                                   <Eye className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary" />
                                </div>
                             </div>
                          </div>
                       </TabsContent>
                       
                       <TabsContent value="academic" className="space-y-4 m-0">
                          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start gap-3">
                             <GraduationCap className="h-5 w-5 text-orange-600 shrink-0" />
                             <div>
                                <p className="text-xs font-bold text-orange-900">Entrance Test Score</p>
                                <p className="text-2xl font-black text-orange-700">88/100</p>
                                <p className="text-[10px] text-orange-600 mt-1 font-medium">Top 5% of candidates this month</p>
                             </div>
                          </div>
                          <div className="space-y-3 pt-2">
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Last GPA</span>
                                <span className="font-bold">3.85 / 4.0</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Previous Grade</span>
                                <span className="font-bold">Grade 8</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Languages</span>
                                <span className="font-bold">English, Kiswahili</span>
                             </div>
                          </div>
                       </TabsContent>
                       
                       <TabsContent value="actions" className="m-0">
                          <div className="space-y-4">
                             <div className="relative pl-6 border-l-2 border-muted pb-4">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                                <p className="text-xs font-bold leading-none">Application Submitted</p>
                                <p className="text-[10px] text-muted-foreground mt-1">April 12, 2024 • 10:30 AM</p>
                             </div>
                             <div className="relative pl-6 border-l-2 border-muted pb-4">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-500 border-2 border-white" />
                                <p className="text-xs font-bold leading-none">Document Review Passed</p>
                                <p className="text-[10px] text-muted-foreground mt-1">April 14, 2024 • 02:45 PM</p>
                             </div>
                             <div className="relative pl-6 border-l-2 border-muted border-dashed">
                                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary border-2 border-white animate-pulse" />
                                <p className="text-xs font-bold leading-none">Interview Scheduled</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Pending Confirmation</p>
                             </div>
                          </div>
                       </TabsContent>
                    </div>
                 </Tabs>
              </CardContent>
              
              <div className="p-6 bg-slate-50 border-t border-border/50 flex flex-col gap-2">
                 <Button className="w-full bg-primary hover:bg-primary/90">Move to Next Stage</Button>
                 <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-xs h-9">Reschedule</Button>
                    <Button variant="outline" className="flex-1 text-xs h-9 text-red-600 hover:text-red-700 hover:bg-red-50">Reject</Button>
                 </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
