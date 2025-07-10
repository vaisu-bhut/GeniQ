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
  BarChart3
} from 'lucide-react';
import { apiService, type QARequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const QAGeneratorSection = () => {
  const [selectedDomain, setSelectedDomain] = useState('healthcare');
  const [complexity, setComplexity] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfidence, setShowConfidence] = useState(false);
  const [numPairs, setNumPairs] = useState([50]);
  const [context, setContext] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const domains = [
    { id: 'healthcare', name: 'Healthcare', icon: Heart, color: 'text-red-400' },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: 'text-green-400' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'text-blue-400' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'text-purple-400' },
  ];

  const sampleQA = [
    {
      question: "What are the primary symptoms of Type 2 diabetes?",
      answer: "The primary symptoms include increased thirst, frequent urination, increased hunger, unintended weight loss, fatigue, and blurred vision.",
      confidence: 94
    },
    {
      question: "How is diabetes diagnosed?",
      answer: "Diabetes is typically diagnosed through blood tests measuring glucose levels, including fasting glucose, random glucose, or HbA1c tests.",
      confidence: 97
    },
    {
      question: "What lifestyle changes help manage diabetes?",
      answer: "Key lifestyle changes include maintaining a healthy diet, regular exercise, weight management, monitoring blood sugar, and taking medications as prescribed.",
      confidence: 92
    }
  ];

  const constraints = ['Medical accuracy', 'Evidence-based', 'Patient-friendly', 'Clinical guidelines'];

  const getComplexityLevel = (value: number): 'beginner' | 'intermediate' | 'advanced' => {
    if (value < 30) return 'beginner';
    if (value < 70) return 'intermediate';
    return 'advanced';
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    setDownloadUrl(null);
    
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
      const request: QARequest = {
        domain: selectedDomain,
        complexity: getComplexityLevel(complexity[0]),
        num_pairs: numPairs[0],
        context: context || undefined,
        constraints: constraints.join(', '),
      };

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
          {/* Configuration Panel */}
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

            {/* Number of Pairs */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Number of Q&A Pairs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-sm">10 pairs</span>
                    <span className="text-sm font-medium">{numPairs[0]} pairs</span>
                    <span className="text-sm">500 pairs</span>
                  </div>
                  <Slider
                    value={numPairs}
                    onValueChange={setNumPairs}
                    max={500}
                    min={10}
                    step={10}
                    className="mb-4"
                  />
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
              </CardContent>
            </Card>

            {/* Constraints */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Content Constraints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {constraints.map((constraint, index) => (
                    <Badge key={index} className="bg-accent/20 text-accent">
                      {constraint}
                    </Badge>
                  ))}
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
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
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

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Sample Output */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Sample Output
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleQA.map((qa, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-accent">Q{index + 1}</div>
                      {showConfidence && (
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
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfidence(!showConfidence)}
                  >
                    {showConfidence ? 'Hide' : 'Show'} Confidence Scores
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    {numPairs[0]} pairs will be generated
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Metrics */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Expected Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">98%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-xs text-muted-foreground">Relevance</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/10 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">92%</div>
                    <div className="text-xs text-muted-foreground">Diversity</div>
                  </div>
                  <div className="text-center p-3 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">89%</div>
                    <div className="text-xs text-muted-foreground">Complexity</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QAGeneratorSection;