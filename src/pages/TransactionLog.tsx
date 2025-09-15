import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

import { 
  Search, 
  Download, 
  Filter, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  CreditCard
} from "lucide-react";

const transactions = [
  {
    id: "TXN001",
    patientName: "John Smith",
    doctorName: "Dr. Sarah Wilson",
    amount: 150.00,
    date: "2024-01-15",
    time: "10:30 AM",
    type: "Consultation",
    status: "Completed",
    paymentMethod: "Credit Card",
    transactionId: "tx_1234567890"
  },
  {
    id: "TXN002", 
    patientName: "Emma Johnson",
    doctorName: "Dr. Mike Chen",
    amount: 200.00,
    date: "2024-01-15",
    time: "2:15 PM",
    type: "Surgery",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    transactionId: "tx_0987654321"
  },
  {
    id: "TXN003",
    patientName: "Robert Brown", 
    doctorName: "Dr. Emily Davis",
    amount: 75.00,
    date: "2024-01-14",
    time: "9:45 AM",
    type: "Check-up",
    status: "Pending",
    paymentMethod: "Credit Card",
    transactionId: "tx_1122334455"
  },
  {
    id: "TXN004",
    patientName: "Lisa Anderson",
    doctorName: "Dr. Sarah Wilson", 
    amount: 300.00,
    date: "2024-01-14",
    time: "4:20 PM",
    type: "Procedure",
    status: "Completed",
    paymentMethod: "Insurance",
    transactionId: "tx_5566778899"
  },
  {
    id: "TXN005",
    patientName: "David Wilson",
    doctorName: "Dr. Robert Kim",
    amount: 120.00,
    date: "2024-01-13",
    time: "11:15 AM", 
    type: "Consultation",
    status: "Refunded",
    paymentMethod: "Credit Card",
    transactionId: "tx_9988776655"
  }
];

const stats = [
  {
    title: "Total Revenue",
    value: "$12,450",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-success"
  },
  {
    title: "Transactions Today",
    value: "23",
    change: "+8.2%", 
    icon: CreditCard,
    color: "text-primary"
  },
  {
    title: "Average Transaction",
    value: "$165",
    change: "+5.1%",
    icon: TrendingUp,
    color: "text-warning"
  },
  {
    title: "Pending Payments",
    value: "5",
    change: "-2.3%",
    icon: Calendar,
    color: "text-destructive"
  }
];

export default function TransactionLog() {
  const navigate = useNavigate(); 
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || transaction.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "pending": return "bg-warning/10 text-warning border-warning/20";
      case "refunded": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transaction Log</h1>
          <p className="text-muted-foreground">Monitor all payment transactions between patients and doctors</p>
        </div>
        <div className="flex gap-2">
          
          <Button className="gap-2" onClick={() => navigate("/generate-report")}>
  <Filter className="h-4 w-4" />
  Generate Report
</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-border shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border border-border shadow-soft">
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
          <CardDescription>Filter transactions by search, status, and type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by patient, doctor, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="check-up">Check-up</SelectItem>
                <SelectItem value="procedure">Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border border-border shadow-soft">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell className="font-medium">{transaction.patientName}</TableCell>
                  <TableCell>{transaction.doctorName}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="font-semibold">${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{transaction.date}</div>
                      <div className="text-muted-foreground">{transaction.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}