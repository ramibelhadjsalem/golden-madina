
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ArtifactDialog from "@/components/admin/ArtifactDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

// Define consistent type for artifacts
type Artifact = {
  id: string;
  name: string;
  period: string;
  category: string;
  hasModel: boolean;
  dateAdded: string;
  description: string; // Make it non-optional here to match MOCK_ARTIFACTS
};

// Temporary mock data until we connect to Supabase
const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: "1",
    name: "Ancient Greek Amphora",
    period: "5th Century BCE",
    category: "Pottery",
    hasModel: true,
    dateAdded: "2023-02-15",
    description: "A large ancient Greek jar with two handles and a narrow neck. Used for storage and transport of wine, olive oil, etc."
  },
  {
    id: "2",
    name: "Medieval Illuminated Manuscript",
    period: "14th Century",
    category: "Books",
    hasModel: false,
    dateAdded: "2023-03-22",
    description: "A handwritten book decorated with gold or silver, brilliant colors, elaborate designs, or miniature illustrations."
  },
  {
    id: "3",
    name: "Bronze Age Ceremonial Mask",
    period: "1200 BCE",
    category: "Ceremonial",
    hasModel: true,
    dateAdded: "2023-04-10",
    description: "A ceremonial mask used in religious rituals during the Bronze Age. Made of hammered bronze with intricate detailing."
  },
  {
    id: "4",
    name: "Victorian Era Pocket Watch",
    period: "1870s",
    category: "Jewelry",
    hasModel: true,
    dateAdded: "2023-05-08",
    description: "An elegant pocket watch from the Victorian era, with gold plating and intricate engravings."
  },
  {
    id: "5",
    name: "Ming Dynasty Porcelain Vase",
    period: "16th Century",
    category: "Pottery",
    hasModel: false,
    dateAdded: "2023-06-14",
    description: "A blue and white porcelain vase from the Ming Dynasty, featuring traditional Chinese motifs."
  }
];

// Define the input type for the dialog
type ArtifactInput = {
  name: string;
  period: string;
  category: string;
  hasModel: boolean;
  description: string; // Make it required here to match the Artifact type
};

const AdminArtifactList = () => {
  const [artifacts, setArtifacts] = useState<Artifact[]>(MOCK_ARTIFACTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | undefined>(undefined);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [artifactToDelete, setArtifactToDelete] = useState<string | null>(null);

  const filteredArtifacts = artifacts.filter(artifact =>
    artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (artifact?: Artifact) => {
    setSelectedArtifact(artifact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedArtifact(undefined);
    setIsDialogOpen(false);
  };

  const handleSaveArtifact = (artifactData: ArtifactInput) => {
    if (selectedArtifact) {
      // Update existing artifact
      setArtifacts(artifacts.map(artifact =>
        artifact.id === selectedArtifact.id ? {
          ...artifact,
          ...artifactData,
          dateAdded: artifact.dateAdded // Preserve original date
        } : artifact
      ));
      toast({
        title: "Artifact Updated",
        description: "The artifact has been successfully updated",
      });
    } else {
      // Create new artifact
      const newArtifact: Artifact = {
        id: (artifacts.length + 1).toString(),
        ...artifactData,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setArtifacts([...artifacts, newArtifact]);
      toast({
        title: "Artifact Created",
        description: "The new artifact has been successfully created",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    setArtifactToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (artifactToDelete) {
      setArtifacts(artifacts.filter(artifact => artifact.id !== artifactToDelete));
      toast({
        title: "Artifact Deleted",
        description: "The artifact has been successfully deleted",
      });
      setIsDeleteAlertOpen(false);
      setArtifactToDelete(null);
    }
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full sm:w-64 md:w-96">
          <Input
            placeholder="Search artifacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Artifact
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artifact</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>3D Model</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArtifacts.length > 0 ? (
                filteredArtifacts.map((artifact) => (
                  <TableRow key={artifact.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="font-medium text-slate-900">{artifact.name}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {artifact.period}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {artifact.category}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${artifact.hasModel
                          ? 'bg-green-100 text-green-800'
                          : 'bg-slate-100 text-slate-800'
                        }`}>
                        {artifact.hasModel ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(artifact.dateAdded).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(artifact)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(artifact.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="text-slate-500">No artifacts found</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog()}
                      className="mt-3"
                    >
                      Add New Artifact
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Artifact Dialog */}
      <ArtifactDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        artifact={selectedArtifact}
        onSave={handleSaveArtifact}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this artifact?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the artifact.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminArtifactList;
