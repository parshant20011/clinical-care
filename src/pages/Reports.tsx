import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const reportSections = [
  {
    category: "End of Month",
    reports: [{ id: 1, name: "Cultural representation data" }],
  },
  {
    category: "Governance",
    reports: [
      { id: 2, name: "Occupancy Report" },
      { id: 3, name: "Power BI Reports" },
    ],
  },
  {
    category: "Clinical Reports",
    reports: [
      { id: 4, name: "Clinical Dashboard" },
      { id: 5, name: "Wound Summary" },
      { id: 6, name: "Care Direct Reports" },
      { id: 7, name: "Wellbeing Reports" },
      { id: 8, name: "Last 72 Hours" },
      { id: 9, name: "Weekly Progress Note Check" },
      { id: 10, name: "Unplanned Weight Loss" },
      { id: 11, name: "AN-ACC Matrix" },
    ],
  },
  {
    category: "CRM",
    reports: [{ id: 12, name: "CRM Reports" }],
  },
  {
    category: "Medication Reports",
    reports: [
      { id: 13, name: "Missed Medications" },
      { id: 14, name: "Psychotropic Health Check" },
    ],
  },
];

export default function Reports() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Management Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Clinical and operational reporting
        </p>
      </div>

      <div className="space-y-6">
        {reportSections.map((section) => (
          <div key={section.category}>
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {section.reports.map((report) => (
                <Card
                  key={report.id}
                  className="cursor-pointer hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">#{report.id}</p>
                      <p className="text-sm font-medium">{report.name}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
