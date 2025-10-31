import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Brain, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Upload = () => {
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [predictions, setPredictions] = useState<Array<{
    predicted: string;
    actual: string;
    timestamp: Date;
  }>>([]);
  const [progress, setProgress] = useState(0);

  const handleDataFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataFile(file);
      toast.success(`Data file "${file.name}" loaded`);
    }
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelFile(file);
      toast.success(`Model file "${file.name}" loaded`);
    }
  };

  const handleStartPrediction = async () => {
    if (!dataFile || !modelFile) {
      toast.error("Please upload both data and model files");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    toast.info("Starting prediction process...");

    // This is a placeholder for the actual processing
    // In production, this would send files to the backend for processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate prediction result
          const predicted = Math.random() > 0.5 ? "L" : "R";
          const actual = Math.random() > 0.5 ? "L" : "R";
          
          setPredictions((prev) => [
            ...prev,
            {
              predicted,
              actual,
              timestamp: new Date(),
            },
          ]);
          
          setCurrentIndex((prev) => prev + 1);
          setIsProcessing(false);
          
          toast.success(`Prediction complete: ${predicted}`, {
            description: `Actual: ${actual}`,
          });
          
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upload & Predict
          </h1>
          <p className="text-muted-foreground">
            Upload your EEG data and model files to start making predictions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <UploadIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Upload Files</h2>
              </div>
              
              <div className="space-y-4">
                {/* Data File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    EEG Data File (.dat)
                    {dataFile && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".dat"
                      onChange={handleDataFileChange}
                      className="hidden"
                      id="data-file"
                    />
                    <label
                      htmlFor="data-file"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <UploadIcon className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-center">
                        {dataFile ? dataFile.name : "Click to upload data file"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Contains tuples of (1000x22 array, L/R)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Model File Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    PyTorch Model (.pth)
                    {modelFile && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept=".pth,.pt"
                      onChange={handleModelFileChange}
                      className="hidden"
                      id="model-file"
                    />
                    <label
                      htmlFor="model-file"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Brain className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-center">
                        {modelFile ? modelFile.name : "Click to upload model file"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Trained PyTorch model for prediction
                      </span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleStartPrediction}
                  disabled={!dataFile || !modelFile || isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? "Processing..." : "Start Prediction"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing data...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-accent/5 border-2 border-accent/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Processing Pipeline</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Extract data from uploaded file</li>
                    <li>Apply bandpass filter (8-30 Hz)</li>
                    <li>Run through PyTorch model</li>
                    <li>Generate L/R prediction</li>
                    <li>Send to ESP32 device</li>
                    <li>Wait 10s before next sample</li>
                  </ol>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <h2 className="text-xl font-bold mb-4">Prediction Results</h2>
              
              {predictions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No predictions yet</p>
                  <p className="text-sm">Upload files and start prediction to see results</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((pred, index) => (
                    <Card key={index} className="p-4 bg-secondary/30">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sample {index + 1}</span>
                            <Badge variant="outline" className="text-xs">
                              {pred.timestamp.toLocaleTimeString()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Predicted:</span>
                              <Badge className="bg-primary">
                                {pred.predicted === "L" ? (
                                  <><ArrowLeft className="w-3 h-3 mr-1" /> Left</>
                                ) : (
                                  <><ArrowRight className="w-3 h-3 mr-1" /> Right</>
                                )}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">Actual:</span>
                              <Badge variant="outline">
                                {pred.actual === "L" ? (
                                  <><ArrowLeft className="w-3 h-3 mr-1" /> Left</>
                                ) : (
                                  <><ArrowRight className="w-3 h-3 mr-1" /> Right</>
                                )}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {pred.predicted === pred.actual ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {predictions.length > 0 && (
              <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                <h3 className="font-bold mb-3">Accuracy</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Correct Predictions</span>
                    <span className="font-bold">
                      {predictions.filter((p) => p.predicted === p.actual).length} / {predictions.length}
                    </span>
                  </div>
                  <Progress
                    value={(predictions.filter((p) => p.predicted === p.actual).length / predictions.length) * 100}
                  />
                  <p className="text-2xl font-bold text-center mt-4">
                    {((predictions.filter((p) => p.predicted === p.actual).length / predictions.length) * 100).toFixed(1)}%
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
