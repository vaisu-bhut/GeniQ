import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { 
  Heart, 
  Activity, 
  Thermometer, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  Target,
  Zap,
  Calculator
} from 'lucide-react';

const AnalyticsSection = () => {
  const [teamSize, setTeamSize] = useState([5]);
  const [costSavings, setCostSavings] = useState(0);

  const calculateROI = () => {
    const monthlyCost = teamSize[0] * 8000; // $8k per person per month
    const savings = monthlyCost * 0.4; // 40% time savings
    setCostSavings(savings);
  };

  const healthMetrics = [
    { name: 'Completeness', value: 98, icon: Heart, color: 'text-green-400' },
    { name: 'Validity', value: 94, icon: Activity, color: 'text-blue-400' },
    { name: 'Specificity', value: 87, icon: Thermometer, color: 'text-orange-400' },
  ];

  const useCases = [
    { 
      title: 'ML Model Training', 
      impact: 'High', 
      timeReduction: '60%',
      description: 'Faster model development with quality synthetic data'
    },
    { 
      title: 'Testing & Validation', 
      impact: 'Medium', 
      timeReduction: '45%',
      description: 'Comprehensive test coverage without privacy concerns'
    },
    { 
      title: 'Development Environment', 
      impact: 'High', 
      timeReduction: '70%',
      description: 'Instant data availability for development teams'
    },
  ];

  const qualityTimeline = [
    { month: 'Jan', quality: 78 },
    { month: 'Feb', quality: 82 },
    { month: 'Mar', quality: 85 },
    { month: 'Apr', quality: 89 },
    { month: 'May', quality: 92 },
    { month: 'Jun', quality: 95 },
  ];

  return (
    <section id="analytics" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-gradient">Analytics</span>
            <span className="text-foreground"> Hub</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Monitor data quality, measure business impact, and optimize your synthetic data strategy
          </p>
        </div>

        {/* Data Health Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {healthMetrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <Card key={index} className="glass">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-6 h-6 ${metric.color}`} />
                      <h3 className="font-heading font-semibold">{metric.name}</h3>
                    </div>
                    <div className="text-2xl font-bold text-accent">{metric.value}%</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-accent rounded-full transition-all duration-1000 animate-pulse"
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                    
                    {metric.name === 'Completeness' && (
                      <div className="text-sm text-muted-foreground">
                        All required fields populated with valid data
                      </div>
                    )}
                    {metric.name === 'Validity' && (
                      <div className="text-sm text-muted-foreground">
                        Data follows specified formats and constraints
                      </div>
                    )}
                    {metric.name === 'Specificity' && (
                      <div className="text-sm text-muted-foreground">
                        Domain-specific patterns and relationships maintained
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Business Value Calculator */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-accent" />
                ROI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Team Size: {teamSize[0]} people
                </label>
                <Slider
                  value={teamSize}
                  onValueChange={setTeamSize}
                  max={50}
                  min={1}
                  step={1}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 person</span>
                  <span>50 people</span>
                </div>
              </div>

              <Button 
                onClick={calculateROI}
                className="w-full bg-gradient-primary"
              >
                <Target className="w-4 h-4 mr-2" />
                Calculate Savings
              </Button>

              {costSavings > 0 && (
                <div className="space-y-4 p-4 bg-accent/10 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      ${costSavings.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly cost savings</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">Time Saved</div>
                      <div className="text-accent">40% faster</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Annual ROI</div>
                      <div className="text-accent">340%</div>
                    </div>
                  </div>
                  
                  <div className="animate-float">
                    <div className="flex items-center justify-center">
                      {Array.from({ length: Math.min(5, Math.floor(costSavings / 10000)) }).map((_, i) => (
                        <DollarSign key={i} className="w-6 h-6 text-accent animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quality Timeline */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Quality Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityTimeline.map((point, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/5 transition-colors cursor-pointer">
                    <div className="w-12 text-sm font-medium">{point.month}</div>
                    <div className="flex-1">
                      <div className="w-full bg-muted h-2 rounded-full">
                        <div 
                          className="h-2 bg-gradient-accent rounded-full transition-all duration-1000"
                          style={{ width: `${point.quality}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm font-bold text-accent">{point.quality}%</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <div className="text-sm font-medium mb-2">Trend Analysis</div>
                <div className="text-xs text-muted-foreground">
                  Quality has improved by 21% over the last 6 months through continuous learning and optimization.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Use Case Impact Cards */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Business Impact Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <div 
                  key={index} 
                  className="p-6 border border-border rounded-lg hover:border-accent/50 transition-all hover:scale-105 cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-semibold">{useCase.title}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        useCase.impact === 'High' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                      }`}>
                        {useCase.impact} Impact
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">{useCase.timeReduction}</div>
                      <div className="text-sm text-muted-foreground">Time Reduction</div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" className="w-full">
                        <Zap className="w-4 h-4 mr-2" />
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AnalyticsSection;