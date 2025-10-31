import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cpu, Wifi, WifiOff, Send, ArrowLeft, ArrowRight, Activity } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getESP32Config, saveESP32Config, sendDirectionToESP32 } from "@/lib/esp32Service";

const ESP32Control = () => {
  const [esp32Address, setEsp32Address] = useState("192.168.1.100");
  const [isConnected, setIsConnected] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<Array<{
    direction: string;
    timestamp: Date;
    status: "success" | "error";
  }>>([]);

  // Load saved configuration on mount
  useEffect(() => {
    const config = getESP32Config();
    if (config.address) {
      setEsp32Address(config.address);
      setIsConnected(config.isConnected);
    }
  }, []);

  const handleConnect = () => {
    if (!esp32Address) {
      toast.error("Please enter ESP32 IP address");
      return;
    }
    
    setIsConnected(true);
    saveESP32Config({ address: esp32Address, isConnected: true });
    toast.success(`Connected to ESP32 at ${esp32Address}`);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    saveESP32Config({ address: esp32Address, isConnected: false });
    toast.info("Disconnected from ESP32");
  };

  const sendDirection = async (direction: "L" | "R") => {
    if (!isConnected) {
      toast.error("Not connected to ESP32");
      return;
    }

    try {
      const success = await sendDirectionToESP32(direction, { address: esp32Address, isConnected });
      
      setLastSent(direction);
      setCommandHistory((prev) => [
        {
          direction,
          timestamp: new Date(),
          status: success ? "success" : "error",
        },
        ...prev,
      ]);
    } catch (error) {
      toast.error("Failed to send direction to ESP32");
      setCommandHistory((prev) => [
        {
          direction,
          timestamp: new Date(),
          status: "error",
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ESP32 Control
          </h1>
          <p className="text-muted-foreground">
            Connect and send predicted directions to your ESP32 device
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Connection Section */}
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Device Connection</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ESP32 IP Address</label>
                  <Input
                    type="text"
                    placeholder="192.168.1.100"
                    value={esp32Address}
                    onChange={(e) => setEsp32Address(e.target.value)}
                    disabled={isConnected}
                  />
                </div>

                <div className="flex gap-2">
                  {!isConnected ? (
                    <Button onClick={handleConnect} className="flex-1">
                      <Wifi className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  ) : (
                    <Button onClick={handleDisconnect} variant="destructive" className="flex-1">
                      <WifiOff className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  )}
                </div>

                <Card className={`p-4 ${isConnected ? "bg-green-500/10 border-green-500/50" : "bg-muted"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                      <span className="font-medium">
                        {isConnected ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    {isConnected && (
                      <Badge variant="outline" className="border-green-500/50">
                        {esp32Address}
                      </Badge>
                    )}
                  </div>
                </Card>
              </div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-accent" />
                <h2 className="text-xl font-bold">Manual Control</h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Send direction commands manually to test ESP32 connection
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => sendDirection("L")}
                    disabled={!isConnected}
                    size="lg"
                    className="h-24 flex-col"
                  >
                    <ArrowLeft className="w-8 h-8 mb-2" />
                    <span className="text-lg font-bold">Left</span>
                  </Button>
                  <Button
                    onClick={() => sendDirection("R")}
                    disabled={!isConnected}
                    size="lg"
                    className="h-24 flex-col"
                  >
                    <ArrowRight className="w-8 h-8 mb-2" />
                    <span className="text-lg font-bold">Right</span>
                  </Button>
                </div>

                {lastSent && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm text-muted-foreground">Last Sent: </span>
                    <span className="font-bold text-primary">
                      {lastSent === "L" ? "Left" : "Right"}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* History Section */}
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Command History</h2>
              </div>
              
              {commandHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No commands sent yet</p>
                  <p className="text-sm">Send directions to see the history</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {commandHistory.map((cmd, index) => (
                    <Card key={index} className="p-4 bg-secondary/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {cmd.direction === "L" ? (
                            <ArrowLeft className="w-5 h-5 text-primary" />
                          ) : (
                            <ArrowRight className="w-5 h-5 text-primary" />
                          )}
                          <div>
                            <p className="font-medium">
                              {cmd.direction === "L" ? "Left" : "Right"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cmd.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={cmd.status === "success" ? "default" : "destructive"}
                        >
                          {cmd.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6 bg-accent/5 border-2 border-accent/20">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-accent" />
                ESP32 Integration Guide
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>To receive predictions on your ESP32:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Connect ESP32 to same network</li>
                  <li>Run web server on ESP32</li>
                  <li>Create endpoint to receive direction data</li>
                  <li>Enter ESP32 IP address above</li>
                  <li>Predictions will be sent automatically</li>
                </ol>
                <p className="mt-3 font-medium">
                  Expected endpoint: <code className="text-xs bg-muted px-2 py-1 rounded">POST /predict</code>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ESP32Control;
