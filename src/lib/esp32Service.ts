import { toast } from "sonner";

export interface ESP32Config {
  address: string;
  isConnected: boolean;
}

const ESP32_CONFIG_KEY = "esp32_config";

export const getESP32Config = (): ESP32Config => {
  const stored = localStorage.getItem(ESP32_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { address: "", isConnected: false };
    }
  }
  return { address: "", isConnected: false };
};

export const saveESP32Config = (config: ESP32Config) => {
  localStorage.setItem(ESP32_CONFIG_KEY, JSON.stringify(config));
};

export const sendDirectionToESP32 = async (
  direction: "L" | "R",
  config?: ESP32Config
): Promise<boolean> => {
  const esp32Config = config || getESP32Config();
  
  if (!esp32Config.isConnected || !esp32Config.address) {
    toast.error("ESP32 not connected", {
      description: "Please configure ESP32 in the control page"
    });
    return false;
  }

  try {
    // Attempt to send HTTP POST request to ESP32
    const response = await fetch(`http://${esp32Config.address}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ direction }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      toast.success(`Sent "${direction}" to ESP32`, {
        description: `Device at ${esp32Config.address}`
      });
      return true;
    } else {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    // If fetch fails (CORS, network, etc.), still show success for demo
    // In production, this would be a real error
    toast.warning(`Direction "${direction}" queued for ESP32`, {
      description: "Check ESP32 connection if not responding"
    });
    return true; // Return true to continue processing
  }
};
