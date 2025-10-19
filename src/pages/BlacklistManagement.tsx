import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Shield,
  AlertTriangle,
  UserX,
  FileX,
  Loader2,
  RefreshCw,
  BarChart3
} from "lucide-react";

import {
  fetchBlacklistEntries,
  fetchBlacklistStats,
  searchBlacklistEntries,
  removeFromBlacklist,
  updateBlacklistEntry,
  BlacklistEntry,
  BlacklistStats,
  getReasonDisplayText,
  getReasonColor,
  formatBlacklistDate
} from "@/services/blacklistService";

export default function BlacklistManagement() {
  const [blacklistEntries, setBlacklistEntries] = useState<BlacklistEntry[]>([]);
  const [stats, setStats] = useState<BlacklistStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  
  // Dialog states
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<{id: string, name: string} | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState<BlacklistEntry | null>(null);
  
  // Form states
  const [editingEntry, setEditingEntry] = useState<BlacklistEntry | null>(null);

  // Load blacklist entries
  const loadBlacklistEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: {
        page?: number;
        limit?: number;
        reason?: string;
        isActive?: boolean;
      } = {};
      if (filterReason !== "all") params.reason = filterReason;
      if (filterStatus !== "all") params.isActive = filterStatus === "active";
      
      const entries = await fetchBlacklistEntries(params);
      setBlacklistEntries(entries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load blacklist entries");
      console.error("Error loading blacklist entries:", err);
    } finally {
      setLoading(false);
    }
  }, [filterReason, filterStatus]);

  // Load statistics
  const loadStats = async () => {
    try {
      const statsData = await fetchBlacklistStats();
      setStats(statsData);
    } catch (err) {
      console.error("Error loading blacklist stats:", err);
    }
  };

  // Search blacklist entries
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadBlacklistEntries();
      return;
    }
    
    try {
      setLoading(true);
      const results = await searchBlacklistEntries(searchTerm);
      setBlacklistEntries(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search blacklist entries");
      console.error("Error searching blacklist entries:", err);
    } finally {
      setLoading(false);
    }
  };


  // Handle edit entry
  const handleEditEntry = async () => {
    if (!editingEntry) return;
    
    try {
      setLoading(true);
      await updateBlacklistEntry(editingEntry._id, editingEntry);
      setShowEditDialog(false);
      setEditingEntry(null);
      await loadBlacklistEntries();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blacklist entry");
      console.error("Error updating blacklist entry:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete entry
  const handleDeleteEntry = async (permanent: boolean = false) => {
    if (!showDeleteDialog) return;
    
    try {
      setLoading(true);
      await removeFromBlacklist(showDeleteDialog.id, permanent);
      setShowDeleteDialog(null);
      await loadBlacklistEntries();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove blacklist entry");
      console.error("Error removing blacklist entry:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadBlacklistEntries();
    loadStats();
  }, [loadBlacklistEntries]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blacklist Management</h1>
          <p className="text-muted-foreground">Manage blacklisted credentials and monitor security</p>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <UserX className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reasons</p>
                  <p className="text-2xl font-bold">{stats.byReason.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by email, phone, name, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button onClick={loadBlacklistEntries} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <Label>Filter by Reason</Label>
              <Select value={filterReason} onValueChange={setFilterReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reasons</SelectItem>
                  <SelectItem value="doctor_deleted">Doctor Deleted</SelectItem>
                  <SelectItem value="candidate_rejected_multiple">Multiple Rejections</SelectItem>
                  <SelectItem value="license_conflict">License Conflict</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="shadow-soft border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <div className="h-4 w-4 rounded-full bg-destructive/20 flex items-center justify-center">
                <span className="text-xs">!</span>
              </div>
              <span>{error}</span>
              <Button variant="outline" size="sm" onClick={() => setError(null)} className="ml-auto">
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blacklist Entries */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Blacklist Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading blacklist entries...</span>
            </div>
          ) : blacklistEntries.length > 0 ? (
            <div className="space-y-4">
              {blacklistEntries.map((entry) => (
                <div key={entry._id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{entry.originalEntityName || "Unknown"}</h3>
                        <Badge className={getReasonColor(entry.reason)}>
                          {getReasonDisplayText(entry.reason)}
                        </Badge>
                        <Badge variant={entry.isActive ? "default" : "secondary"}>
                          {entry.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        {entry.email && (
                          <div>
                            <span className="font-medium">Email:</span> {entry.email}
                          </div>
                        )}
                        {entry.phone && (
                          <div>
                            <span className="font-medium">Phone:</span> {entry.phone}
                          </div>
                        )}
                        {entry.licenses && entry.licenses.length > 0 && (
                          <div>
                            <span className="font-medium">Licenses:</span> {entry.licenses.join(", ")}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Added:</span> {formatBlacklistDate(entry.blacklistedAt)}
                        </div>
                      </div>
                      
                      {entry.description && (
                        <p className="text-sm text-muted-foreground mt-2">{entry.description}</p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDetailsDialog(entry)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingEntry(entry);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteDialog({id: entry._id, name: entry.originalEntityName || "Unknown"})}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileX className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No blacklist entries found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search criteria." : "No entries match the current filters."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Blacklist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{showDeleteDialog?.name}</strong> from the blacklist?
              <br /><br />
              You can either deactivate the entry (reversible) or permanently delete it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteEntry(false)}
              className="bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deactivating...
                </>
              ) : (
                "Deactivate"
              )}
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => handleDeleteEntry(true)}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Permanently Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
