import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  User,
} from "lucide-react";

const articles = [
  {
    id: 1,
    title: "Understanding Heart Disease: Prevention and Treatment",
    author: "Dr. Sarah Johnson",
    category: "Cardiology",
    status: "pending",
    submittedDate: "2024-01-20",
    wordCount: 2500,
    reads: 0,
    excerpt:
      "A comprehensive guide to understanding cardiovascular health and modern treatment approaches...",
    avatar: "/placeholder-doctor1.jpg",
  },
  {
    id: 2,
    title: "Mental Health in the Digital Age",
    author: "Dr. Michael Chen",
    category: "Psychology",
    status: "published",
    submittedDate: "2024-01-15",
    publishedDate: "2024-01-18",
    wordCount: 1800,
    reads: 1247,
    excerpt:
      "Exploring the impact of technology on mental health and coping strategies for the modern world...",
    avatar: "/placeholder-doctor2.jpg",
  },
  {
    id: 3,
    title: "Advances in Cancer Treatment: Hope for Tomorrow",
    author: "Dr. Emily Rodriguez",
    category: "Oncology",
    status: "review",
    submittedDate: "2024-01-22",
    wordCount: 3200,
    reads: 0,
    excerpt:
      "Latest breakthroughs in cancer research and innovative treatment methodologies...",
    avatar: "/placeholder-doctor3.jpg",
  },
  {
    id: 4,
    title: "Nutrition and Immunity: Building Strong Defenses",
    author: "Dr. James Wilson",
    category: "Nutrition",
    status: "published",
    submittedDate: "2024-01-10",
    publishedDate: "2024-01-12",
    wordCount: 2100,
    reads: 2340,
    excerpt:
      "How proper nutrition can boost your immune system and protect against diseases...",
    avatar: "/placeholder-doctor4.jpg",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "published":
      return "bg-success/10 text-success border-success/20";
    case "pending":
      return "bg-warning/10 text-warning border-warning/20";
    case "review":
      return "bg-primary/10 text-primary border-primary/20";
    case "rejected":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

export default function Articles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const navigate = useNavigate(); // ✅ React Router navigation

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? article.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const handleCardClick = (status: string | null) => {
    setStatusFilter(status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Articles Management
          </h1>
          <p className="text-muted-foreground">
            Review, edit, and publish medical articles
          </p>
        </div>
        {/* ✅ Navigate to route instead of trying to push a component */}
        <Button variant="gradient" onClick={() => navigate("/articles/upload")}>
          <FileText className="h-4 w-4" />
          Upload Article
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className={`shadow-soft cursor-pointer ${
            statusFilter === "pending" ? "ring-2 ring-warning" : ""
          }`}
          onClick={() =>
            handleCardClick(statusFilter === "pending" ? null : "pending")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">
                  {articles.filter((a) => a.status === "pending").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-soft cursor-pointer ${
            statusFilter === "review" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() =>
            handleCardClick(statusFilter === "review" ? null : "review")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Review</p>
                <p className="text-xl font-bold">
                  {articles.filter((a) => a.status === "review").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`shadow-soft cursor-pointer ${
            statusFilter === "published" ? "ring-2 ring-success" : ""
          }`}
          onClick={() =>
            handleCardClick(statusFilter === "published" ? null : "published")
          }
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-xl font-bold">
                  {articles.filter((a) => a.status === "published").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reads</p>
                <p className="text-xl font-bold">
                  {articles
                    .reduce((sum, a) => sum + (a.reads || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles by title, author, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Card
              key={article.id}
              className="shadow-soft hover:shadow-medium transition-smooth"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={article.avatar} />
                    <AvatarFallback className="bg-gradient-secondary">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          by {article.author} • {article.category}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {article.status === "pending" && (
                            <DropdownMenuItem>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{article.wordCount} words</span>
                        <span>Submitted: {article.submittedDate}</span>
                        {article.status === "published" && (
                          <span>{article.reads} reads</span>
                        )}
                      </div>
                      <Badge className={getStatusColor(article.status)}>
                        {article.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground text-center mt-6">
            No articles found for the selected filter.
          </p>
        )}
      </div>
    </div>
  );
}
