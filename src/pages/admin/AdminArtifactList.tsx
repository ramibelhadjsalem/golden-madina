
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

// Temporary mock data until we connect to Supabase
const MOCK_ARTIFACTS = [
  {
    id: "1",
    name: "Ancient Greek Amphora",
    period: "5th Century BCE",
    category: "Pottery",
    hasModel: true,
    dateAdded: "2023-02-15"
  },
  {
    id: "2",
    name: "Medieval Illuminated Manuscript",
    period: "14th Century",
    category: "Books",
    hasModel: false,
    dateAdded: "2023-03-22"
  },
  {
    id: "3",
    name: "Bronze Age Ceremonial Mask",
    period: "1200 BCE",
    category: "Ceremonial",
    hasModel: true,
    dateAdded: "2023-04-10"
  },
  {
    id: "4",
    name: "Victorian Era Pocket Watch",
    period: "1870s",
    category: "Jewelry",
    hasModel: true,
    dateAdded: "2023-05-08"
  },
  {
    id: "5",
    name: "Ming Dynasty Porcelain Vase",
    period: "16th Century",
    category: "Pottery",
    hasModel: false,
    dateAdded: "2023-06-14"
  }
];

const AdminArtifactList = () => {
  const [artifacts, setArtifacts] = useState(MOCK_ARTIFACTS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredArtifacts = artifacts.filter(artifact => 
    artifact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artifact.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this artifact?")) {
      // Here we would normally delete from Supabase
      setArtifacts(artifacts.filter(artifact => artifact.id !== id));
      toast({
        title: "Artifact Deleted",
        description: "The artifact has been successfully deleted",
      });
    }
  };

  return (
    <AdminLayout pageTitle="Artifacts Collection">
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
        <Link to="/admin/artifacts/new">
          <Button className="w-full sm:w-auto">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add New Artifact
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Artifact</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">3D Model</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredArtifacts.length > 0 ? (
                filteredArtifacts.map((artifact) => (
                  <tr key={artifact.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{artifact.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {artifact.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {artifact.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        artifact.hasModel 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {artifact.hasModel ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(artifact.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/admin/artifacts/edit/${artifact.id}`} 
                          className="text-slate-600 hover:text-slate-900"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          onClick={() => handleDelete(artifact.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-500">No artifacts found</div>
                    <Link to="/admin/artifacts/new" className="inline-block mt-3">
                      <Button variant="outline" size="sm">Add New Artifact</Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminArtifactList;
