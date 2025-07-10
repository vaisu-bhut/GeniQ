import FeatureCard from './FeatureCard';
import { Database, Shield, Zap, BarChart3, Brain, Lock, Sparkles, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FeaturesSection = () => {
  const features = [
    {
      icon: Database,
      title: 'Tabular Data Generation',
      description: 'Create realistic structured datasets with custom schemas, data types, and business rules that mirror your production data.',
    },
    {
      icon: Brain,
      title: 'Q&A Pair Generation',
      description: 'Generate domain-specific question-answer pairs for training conversational AI, chatbots, and knowledge systems.',
    },
    {
      icon: Shield,
      title: 'Privacy & Compliance',
      description: 'Built-in GDPR, HIPAA, and SOC2 compliance with advanced differential privacy and data anonymization.',
    },
    {
      icon: Zap,
      title: 'Real-time Generation',
      description: 'Lightning-fast synthetic data creation with live preview and instant quality validation.',
    },
    {
      icon: BarChart3,
      title: 'Quality Analytics',
      description: 'Comprehensive data quality reports with distribution analysis, correlation preservation, and validity metrics.',
    },
    {
      icon: Lock,
      title: 'Responsible AI Guardrails',
      description: 'Advanced content moderation, bias detection, and ethical AI safeguards built into every generation.',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 20% 50%, rgba(13, 115, 119, 0.3) 0%, transparent 50%), 
                                radial-gradient(circle at 80% 20%, rgba(162, 57, 234, 0.3) 0%, transparent 50%), 
                                radial-gradient(circle at 40% 80%, rgba(33, 230, 193, 0.3) 0%, transparent 50%)` 
             }} 
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-foreground">Powerful Features</span>
          </div>
          
          <h2 className="font-heading font-bold text-4xl lg:text-6xl mb-6">
            <span className="text-foreground">Everything you need for</span>
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Synthetic Data Excellence
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto">
            From simple tabular data to complex conversational AI training sets, 
            our platform provides enterprise-grade synthetic data generation with 
            unmatched quality and compliance.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center">
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <Target className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-4">
              Ready to Transform Your AI Training?
            </h3>
            <p className="text-muted-foreground font-body mb-6">
              Join thousands of AI teams using our platform to accelerate their development 
              with high-quality synthetic data.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-accent hover:scale-105 transition-all duration-300 glow-accent font-heading font-semibold"
            >
              Start Generating Data
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;