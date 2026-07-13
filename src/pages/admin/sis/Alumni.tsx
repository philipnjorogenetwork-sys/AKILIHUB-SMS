import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Award, Search, MessageSquare, ExternalLink, Calendar, Edit2, Mail, Phone, Briefcase, MapPin
} from "lucide-react";
import { toast } from "sonner";

export default function Alumni() {
  const [alumni, setAlumni] = useState([
    {
      id: 1,
      name: "David Kimathi",
      year: "2018",
      email: "david@example.com",
      phone: "0722123456",
      company: "University of Nairobi",
      position: "Lecturer",
      city: "Nairobi",
      verified: true
    },
    {
      id: 2,
      name: "Sarah Wangari",
      year: "2020",
      email: "sarah@example.com",
      phone: "0722234567",
      company: "PwC Kenya",
      position: "Senior Consultant",
      city: "Nairobi",
      verified: true
    },
    {
      id: 3,
      name: "John Musyoka",
      year: "2015",
      email: "john@example.com",
      phone: "0722345678",
      company: "Equity Bank",
      position: "Manager",
      city: "Kisumu",
      verified: true
    }
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [editData, setEditData] = useState<any>(null);

  const filteredAlumni = alumni.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.year.includes(searchQuery) ||
    member.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = () => {
    if (!editData || !selectedAlumni) return;
    setAlumni(alumni.map(a => a.id === selectedAlumni.id ? { ...a, ...editData } : a));
    toast.success("Alumni record updated");
    setShowEditDialog(false);
    setShowDetailDialog(false);
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success(`Message sent to ${alumni.length} alumni`);
    setBroadcastMessage("");
    setShowBroadcastDialog(false);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni Network</h1>
          <p className="text-muted-foreground">Keep track of graduates and their professional progress</p>
        </div>
        <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <MessageSquare className="mr-2 h-4 w-4" /> Broadcast
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Broadcast Message to Alumni</DialogTitle>
              <DialogDescription>Send a message to all {alumni.length} alumni members</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject..."
                  className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <textarea
                  placeholder="Type your message..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>Cancel</Button>
              <Button onClick={handleBroadcast} className="bg-blue-600 hover:bg-blue-700">Send</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Alumni</p>
            <p className="text-2xl font-bold mt-2">{alumni.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Verified</p>
            <p className="text-2xl font-bold mt-2 text-emerald-600">{alumni.filter(a => a.verified).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Companies</p>
            <p className="text-2xl font-bold mt-2 text-blue-600">{new Set(alumni.map(a => a.company)).size}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search alumni..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 px-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Alumni Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.map(member => (
          <Card
            key={member.id}
            className="border-border/50 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setSelectedAlumni(member);
              setEditData(member);
              setShowDetailDialog(true);
            }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 ring-2 ring-amber-50">
                  <Award className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400">Class of {member.year}</p>
                  {member.verified && (
                    <Badge className="mt-1 bg-emerald-100 text-emerald-800 text-[10px]">Verified</Badge>
                  )}
                </div>
              </div>
              <CardTitle className="mt-4">{member.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{member.position}</p>
                  <p className="text-xs text-muted-foreground">{member.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{member.city}</span>
              </div>
              <div className="pt-2 border-t border-border/50 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Mail className="mr-1.5 h-3 w-3" /> Contact
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <ExternalLink className="mr-1.5 h-3 w-3" /> Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAlumni?.name}</DialogTitle>
            <DialogDescription>Alumni profile and contact information</DialogDescription>
          </DialogHeader>
          {selectedAlumni && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Graduation Year</p>
                  <p className="text-sm mt-1">{selectedAlumni.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm mt-1">{selectedAlumni.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm mt-1">{selectedAlumni.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="text-sm mt-1">{selectedAlumni.city}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Current Position</p>
                  <p className="text-sm mt-1">{selectedAlumni.position} at {selectedAlumni.company}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex gap-2">
                <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      <Edit2 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Alumni Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                          type="text"
                          value={editData?.name || ""}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                          type="email"
                          value={editData?.email || ""}
                          onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                          className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Company</label>
                        <input
                          type="text"
                          value={editData?.company || ""}
                          onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                          className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Position</label>
                        <input
                          type="text"
                          value={editData?.position || ""}
                          onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                          className="w-full px-4 py-2 mt-2 bg-secondary border border-border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                      <Button onClick={handleEdit}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" /> Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
