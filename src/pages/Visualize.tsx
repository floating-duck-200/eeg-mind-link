import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, LineChart as LineChartIcon, Activity } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Visualize = () => {
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string>("0");
  const [sampleData, setSampleData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataFile(file);
      toast.success(`File "${file.name}" loaded`);
      
      // Generate sample EEG data for visualization
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        time: i * 10, // milliseconds
        value: Math.sin(i * 0.1) * 50 + Math.random() * 20 - 10,
      }));
      setSampleData(mockData);
    }
  };

  const channels = Array.from({ length: 22 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EEG Visualization
          </h1>
          <p className="text-muted-foreground">
            Visualize and analyze your 22-channel EEG data in real-time
          </p>
        </div>

        <div className="grid gap-6">
          {/* Upload Section */}
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Load EEG Data</h2>
              </div>
              {dataFile && (
                <span className="text-sm text-muted-foreground">{dataFile.name}</span>
              )}
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".dat"
                  onChange={handleFileChange}
                  className="hidden"
                  id="eeg-file"
                />
                <label
                  htmlFor="eeg-file"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground text-center">
                    {dataFile ? "Change file" : "Click to upload EEG data"}
                  </span>
                </label>
              </div>
              
              {dataFile && (
                <div className="flex items-center gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Select Channel</label>
                    <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        {channels.map((ch) => (
                          <SelectItem key={ch} value={ch.toString()}>
                            Channel {ch + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Visualization Section */}
          {sampleData.length > 0 ? (
            <>
              <Card className="p-6 border-2">
                <div className="flex items-center gap-2 mb-4">
                  <LineChartIcon className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-bold">Channel {parseInt(selectedChannel) + 1} Signal</h2>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="time"
                      label={{ value: "Time (ms)", position: "insideBottom", offset: -5 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      label={{ value: "Amplitude (μV)", angle: -90, position: "insideLeft" }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      name="EEG Signal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="font-bold">Signal Statistics</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mean:</span>
                      <span className="font-medium">
                        {(sampleData.reduce((sum, d) => sum + d.value, 0) / sampleData.length).toFixed(2)} μV
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max:</span>
                      <span className="font-medium">
                        {Math.max(...sampleData.map((d) => d.value)).toFixed(2)} μV
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min:</span>
                      <span className="font-medium">
                        {Math.min(...sampleData.map((d) => d.value)).toFixed(2)} μV
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2 border-accent/20 bg-accent/5">
                  <div className="flex items-center gap-3 mb-2">
                    <LineChartIcon className="w-5 h-5 text-accent" />
                    <h3 className="font-bold">Filter Settings</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">Bandpass</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Low Cut:</span>
                      <span className="font-medium">8 Hz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">High Cut:</span>
                      <span className="font-medium">30 Hz</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-2">
                  <h3 className="font-bold mb-2">Data Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Channels:</span>
                      <span className="font-medium">22</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Samples:</span>
                      <span className="font-medium">1000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">~4 sec</span>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            <Card className="p-12 border-2 border-dashed">
              <div className="text-center text-muted-foreground">
                <LineChartIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No data loaded</p>
                <p className="text-sm">Upload an EEG data file to visualize the signals</p>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Visualize;
