import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Upload, LineChart, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload & Predict",
      description: "Upload EEG data files and PyTorch models for real-time left/right direction prediction",
      link: "/upload",
      color: "from-primary to-accent",
    },
    {
      icon: LineChart,
      title: "Visualize EEG",
      description: "Interactive visualization of 22-channel EEG signals with detailed analysis",
      link: "/visualize",
      color: "from-accent to-primary",
    },
    {
      icon: Cpu,
      title: "ESP32 Control",
      description: "Monitor and send predicted directions to your ESP32 device in real-time",
      link: "/esp32",
      color: "from-primary via-accent to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg animate-pulse">
            <Brain className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            EEG Direction Predictor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced neural signal analysis for predicting left/right directional thought patterns
            using 22-channel EEG data and machine learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 bg-card/80 backdrop-blur-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
                <Link to={feature.link}>
                  <Button className="w-full group">
                    Get Started
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-card to-secondary/30 border-2">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              How It Works
            </h3>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>Upload your .dat file containing EEG data (1000x22 arrays)</li>
              <li>Upload your trained PyTorch model (.pth file)</li>
              <li>System applies bandpass filter (8-30 Hz) to signals</li>
              <li>Model predicts left/right direction from filtered data</li>
              <li>Results are displayed and sent to ESP32 device</li>
              <li>New data is processed every 10 seconds automatically</li>
            </ol>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-accent/10 border-2">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-accent" />
              Technical Specifications
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong>Channels:</strong> 22 EEG channels</li>
              <li><strong>Data Points:</strong> 1000 samples per recording</li>
              <li><strong>Bandpass Filter:</strong> 8-30 Hz (Alpha/Beta waves)</li>
              <li><strong>Model Format:</strong> PyTorch (.pth)</li>
              <li><strong>Processing Interval:</strong> 10 seconds</li>
              <li><strong>Output:</strong> Left (L) / Right (R) prediction</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
