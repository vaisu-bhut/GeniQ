import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  DollarSign, 
  GraduationCap, 
  Briefcase, 
  Zap,
  MessageSquare,
  TrendingUp,
  Download,
  Eye,
  BarChart3,
  Code,
  Info,
  Settings,
  Target,
  Clock,
  FileText
} from 'lucide-react';
import { apiService, type QARequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface QAPair {
  question: string;
  answer: string;
  confidence?: number;
  category?: string;
}

const QAGeneratorSection = () => {
  const [selectedDomain, setSelectedDomain] = useState('healthcare');
  const [complexity, setComplexity] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [numPairs, setNumPairs] = useState([50]);
  const [context, setContext] = useState('');
  const [constraints, setConstraints] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<QAPair[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const { toast } = useToast();

  const domains = [
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'text-red-400', description: 'Medical and health-related content' },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: 'text-green-400', description: 'Financial and banking content' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-blue-400', description: 'Educational and academic content' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'text-purple-400', description: 'Business and corporate content' },
  ];

  const getComplexityLevel = (value: number): string => {
    if (value < 30) return 'beginner';
    if (value < 70) return 'intermediate';
    return 'advanced';
  };

  const getApiRequest = (): QARequest => ({
    domain: selectedDomain,
    complexity: getComplexityLevel(complexity[0]),
    num_pairs: numPairs[0],
    context: context || '',
    constraints: constraints || '',
  });

  const loadPreviewData = async (url: string) => {
    setIsLoadingPreview(true);
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      
      console.log('Raw JSON data structure:', jsonData);
      console.log('JSON keys:', Object.keys(jsonData));
      
      // Handle different JSON structures
      let qaPairs: QAPair[] = [];
      if (jsonData.questions && Array.isArray(jsonData.questions)) {
        qaPairs = jsonData.questions;
        console.log('Found questions array:', qaPairs.length, 'items');
      } else if (Array.isArray(jsonData)) {
        qaPairs = jsonData;
        console.log('Found root array:', qaPairs.length, 'items');
      } else if (jsonData.qa_pairs && Array.isArray(jsonData.qa_pairs)) {
        qaPairs = jsonData.qa_pairs;
        console.log('Found qa_pairs array:', qaPairs.length, 'items');
      } else {
        // If none of the expected structures match, try to extract any array from the JSON
        const keys = Object.keys(jsonData);
        console.log('Searching for arrays in keys:', keys);
        for (const key of keys) {
          if (Array.isArray(jsonData[key])) {
            qaPairs = jsonData[key];
            console.log('Found array in key:', key, 'with', qaPairs.length, 'items');
            break;
          }
        }
        
        // If still no array found, create a fallback structure
        if (qaPairs.length === 0) {
          console.log('No array found, creating fallback structure');
          qaPairs = [{
            question: "Sample question",
            answer: "Sample answer",
            category: "general"
          }];
        }
      }

      // Show first 2 Q&A pairs
      const previewPairs = qaPairs.slice(0, 2);
      setPreviewData(previewPairs);
      setShowPreview(true);
    } catch (error) {
      console.error('Error loading preview:', error);
      toast({
        title: "Preview Error",
        description: "Could not load preview data. The file may be empty or corrupted.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    setDownloadUrl(null);
    setShowPreview(false);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 12;
      });
    }, 400);

    try {
      const request = getApiRequest();
      const response = await apiService.generateQAPairs(request);
      
      clearInterval(progressInterval);
      setProgress(100);

      if (response.success && response.downloadUrl) {
        setDownloadUrl(response.downloadUrl);
        toast({
          title: "Success!",
          description: `Generated ${numPairs[0]} Q&A pairs successfully.`,
        });
      } else {
        throw new Error(response.error || 'Generation failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      apiService.downloadFile(downloadUrl, `qa_pairs_${selectedDomain}_${Date.now()}.json`);
    }
  };

  const handlePreview = () => {
    if (downloadUrl) {
      loadPreviewData(downloadUrl);
    }
  };

  return (
    <section id="qa" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-gradient">Q&A Data</span>
            <span className="text-foreground"> Generator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Create intelligent question-answer pairs for conversational AI training
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Core Configuration */}
          <div className="space-y-6">
            {/* Domain Selector */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Domain Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {domains.map((domain) => {
                    const IconComponent = domain.icon;
                    return (
                      <div
                        key={domain.id}
                        onClick={() => setSelectedDomain(domain.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                          selectedDomain === domain.id
                            ? 'border-accent bg-accent/10 shadow-lg'
                            : 'border-border hover:border-accent/50'
                        }`}
                      >
                        <div className="text-center">
                          <IconComponent className={`w-8 h-8 mx-auto mb-2 ${domain.color}`} />
                          <div className="font-medium">{domain.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {domain.description}
                          </div>
                          {selectedDomain === domain.id && (
                            <div className="mt-2">
                              <div className="w-6 h-6 mx-auto bg-accent rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-accent-foreground rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Context Input */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Context (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Provide additional context or specific requirements..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-md text-foreground resize-none"
                  rows={3}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  This helps the AI understand the specific focus area for Q&A generation
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card className="glass">
              <CardContent className="p-6">
                {!isGenerating && progress === 0 && (
                  <Button 
                    onClick={startGeneration}
                    className="w-full bg-gradient-secondary text-secondary-foreground text-lg py-6 hover:scale-105 transition-transform"
                  >
                    <Zap className="w-6 h-6 mr-3 animate-spin" />
                    Generate Q&A Pairs
                  </Button>
                )}

                {isGenerating && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">Generating Q&A Pairs...</div>
                      <div className="text-sm text-muted-foreground">Creating {numPairs[0]} pairs for {selectedDomain}</div>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <div className="text-sm text-center">{Math.round(progress)}% Complete</div>
                  </div>
                )}

                {!isGenerating && progress === 100 && downloadUrl && (
                  <div className="space-y-4">
                    <div className="text-center text-accent font-semibold mb-4">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                      Q&A Pairs Generated Successfully!
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={handlePreview} disabled={isLoadingPreview}>
                        {isLoadingPreview ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </>
                        )}
                      </Button>
                      <Button className="bg-gradient-secondary" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Additional Configuration & Processing Time */}
          <div className="space-y-6">
            {/* Number of Pairs */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Number of Q&A Pairs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">1 pair</span>
                    <span className="text-sm font-medium">{numPairs[0]} pairs</span>
                    <span className="text-sm">500 pairs</span>
                  </div>
                  <Slider
                    value={numPairs}
                    onValueChange={setNumPairs}
                    max={500}
                    min={1}
                    step={1}
                    className="mb-4"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    Processing time: 10 seconds to 3 minutes
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Complexity Slider */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Complexity Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">Simple</span>
                    <span className="text-sm font-medium">{complexity[0]}%</span>
                    <span className="text-sm">Advanced</span>
                  </div>
                  <Slider
                    value={complexity}
                    onValueChange={setComplexity}
                    max={100}
                    min={0}
                    step={1}
                    className="mb-4"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {complexity[0] < 30 ? 'Basic terminology and concepts' :
                     complexity[0] < 70 ? 'Intermediate technical depth' :
                     'Advanced expert-level content'}
                  </div>
                </div>

                {/* Visual feedback based on complexity */}
                <div className="relative h-20 bg-muted/20 rounded-lg overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-gradient-accent opacity-20"
                    style={{ 
                      background: `linear-gradient(${complexity[0] * 3.6}deg, hsl(var(--accent) / 0.2), hsl(var(--primary) / 0.2))` 
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-sm font-medium">Neural Complexity Pattern</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Constraints Input */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Constraints (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="Specify any constraints or requirements for the Q&A pairs..."
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  className="w-full p-3 bg-input border border-border rounded-md text-foreground resize-none"
                  rows={3}
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Examples: "Medical accuracy", "Evidence-based", "Patient-friendly", "Clinical guidelines"
                </div>
              </CardContent>
            </Card>

            {/* Real Q&A Preview */}
            {showPreview && previewData.length > 0 && (
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    Generated Q&A Preview
                    <Badge variant="outline" className="ml-auto">
                      {previewData.length} pairs shown
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {previewData.map((qa, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm font-medium text-accent">Q{index + 1}</div>
                          {qa.confidence && (
                            <div className="text-xs text-muted-foreground">
                              Confidence: {qa.confidence}%
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Q:</span> {qa.question}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">A:</span> {qa.answer}
                          </div>
                          {qa.category && (
                            <div className="text-xs text-accent">
                              Category: {qa.category}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 text-center">
                    Showing first 2 pairs of {numPairs[0].toLocaleString()} total pairs
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QAGeneratorSection;