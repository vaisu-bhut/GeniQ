// API service for communicating with the GeniQ backend
const API_BASE_URL = 'http://localhost:8000';

export interface ColumnDefinition {
  name: string;
  dtype: string;
  description: string;
  validation?: string;
  options?: (string | number)[];
}

export interface TabularRequest {
  columns: ColumnDefinition[];
  num_rows: number;
  description: string;
  use_case: string;
  output_format: 'csv' | 'json';
}

export interface QARequest {
  domain: string;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  num_pairs: number;
  context?: string;
  constraints?: string;
}

export interface QualityReport {
  completeness: number;
  validity: number;
  specificity: number;
  overall_score: number;
}

export interface BusinessValue {
  time_savings: number;
  cost_reduction: number;
  roi_percentage: number;
}

export interface EfficiencyMetrics {
  generation_time: number;
  items_per_second: number;
  memory_usage: number;
}

export interface SafetyReport {
  pii_detected: boolean;
  content_flags: string[];
  risk_score: number;
}

export interface EthicsReport {
  bias_detected: boolean;
  fairness_score: number;
  violations: string[];
}

export interface GenerationMetadata {
  quality_report?: QualityReport;
  business_value?: BusinessValue;
  efficiency_metrics?: EfficiencyMetrics;
  safety_report?: SafetyReport;
  ethics_report?: EthicsReport;
}

export interface GenerationResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  downloadUrl?: string;
  metadata?: GenerationMetadata;
}

export interface FeedbackSubmission {
  dataset_id: string;
  rating: number;
  comments: string;
  improvements: string[];
}

export interface FeedbackReport {
  average_rating: number;
  total_submissions: number;
  improvement_suggestions: string[];
  quality_trends: unknown;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      // Check if response is a file download
      const contentType = response.headers.get('content-type');
      if (contentType && (contentType.includes('text/csv') || contentType.includes('application/json'))) {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        return { downloadUrl } as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async generateTabularData(request: TabularRequest): Promise<GenerationResponse> {
    try {
      const result = await this.makeRequest<{ downloadUrl: string }>('/generate/tabular', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return {
        success: true,
        downloadUrl: result.downloadUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async generateQAPairs(request: QARequest): Promise<GenerationResponse> {
    try {
      const result = await this.makeRequest<{ downloadUrl: string }>('/generate/qa', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return {
        success: true,
        downloadUrl: result.downloadUrl,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async submitFeedback(datasetId: string, rating: number, comments: string, improvements: string[]): Promise<{ status: string }> {
    return this.makeRequest<{ status: string }>('/submit-feedback', {
      method: 'POST',
      body: JSON.stringify({
        dataset_id: datasetId,
        rating,
        comments,
        improvements,
      }),
    });
  }

  async getFeedbackReport(): Promise<FeedbackReport> {
    return this.makeRequest<FeedbackReport>('/feedback-report');
  }

  // Helper method to download generated files
  downloadFile(url: string, filename: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const apiService = new ApiService();
export default apiService; 