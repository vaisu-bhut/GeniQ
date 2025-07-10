import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Database, MessageSquare, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import ParticleField from './ParticleField';
import DNAHelix from './DNAHelix';

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const DashboardSection = () => {
  return (
    <section id="dashboard" className="relative min-h-screen pt-20 pb-16">
      <ParticleField />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl mt-36 md:text-7xl font-heading font-bold mb-6">
            <span className="text-gradient">Generate Perfect</span>
            <br />
            <span className="text-foreground text-glow">Training Data</span>
            <br />
            <span className="text-accent">in 3 Clicks</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Intelligent Synthetic Data Generation for AI Training
          </p>
          
          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-gradient-primary text-primary-foreground pulse-blue hover:scale-105 transition-transform"
              onClick={() => scrollToSection('tabular')}
            >
              <Database className="w-6 h-6 mr-3" />
              Tabular Data
            </Button>
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg bg-gradient-accent text-accent-foreground pulse-green hover:scale-105 transition-transform"
              onClick={() => scrollToSection('qa')}
            >
              <MessageSquare className="w-6 h-6 mr-3" />
              Q&A Pairs
            </Button>
          </div>
        </div>
        
        {/* DNA Helix Animation */}
        <div className="mb-16">
          <DNAHelix />
        </div>
        
        {/* Stats Ticker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-2">1,247,892</div>
              <div className="text-muted-foreground">Datasets Generated</div>
              <div className="w-full bg-muted h-2 rounded-full mt-3">
                <div className="bg-gradient-accent h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">47.2M</div>
              <div className="text-muted-foreground">Rows Created</div>
              <div className="w-full bg-muted h-2 rounded-full mt-3">
                <div className="bg-gradient-primary h-2 rounded-full w-4/5 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">98.7%</div>
              <div className="text-muted-foreground">Quality Score</div>
              <div className="w-full bg-muted h-2 rounded-full mt-3">
                <div className="bg-gradient-secondary h-2 rounded-full w-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Projects */}
        <div className="mb-16">
          <h3 className="text-2xl font-heading font-bold text-center mb-8 text-glow">Recent Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Customer Analytics', type: 'Tabular', quality: 94, rows: '12.5K' },
              { name: 'Medical Q&A', type: 'Conversational', quality: 97, rows: '8.2K' },
              { name: 'Financial Records', type: 'Tabular', quality: 92, rows: '25.1K' },
            ].map((project, index) => (
              <Card key={index} className="glass hover:scale-105 transition-transform cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading font-semibold">{project.name}</h4>
                    <div className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full">
                      {project.type}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Quality Score</span>
                      <span className="text-accent">{project.quality}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rows</span>
                      <span className="text-primary">{project.rows}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;