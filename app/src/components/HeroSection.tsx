import { Button } from '@/components/ui/button';
import ParticleField from './ParticleField';
import DNAHelix from './DNAHelix';
import { ArrowRight, Database, MessageSquare, Sparkles } from 'lucide-react';
import heroBackground from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Particle Field */}
      <ParticleField />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-primary opacity-90" />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="text-center lg:text-left space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-foreground">AI-Powered Synthetic Data</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-heading font-bold text-5xl lg:text-7xl leading-tight">
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Transform AI Training
            </span>
            <br />
            <span className="text-foreground">
              with Perfect
            </span>
            <br />
            <span className="text-accent animate-glow">
              Synthetic Data
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-muted-foreground font-body max-w-2xl">
            Generate high-quality, privacy-compliant synthetic datasets and Q&A pairs 
            that accelerate your AI development while maintaining data integrity.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-gradient-primary hover:scale-105 transition-all duration-300 glow-primary font-heading font-semibold text-lg px-8 py-6"
            >
              <Database className="w-5 h-5 mr-2" />
              Create Tabular Data
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-20 transition-opacity" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="group relative overflow-hidden border-accent text-accent hover:bg-accent hover:text-background transition-all duration-300 glow-accent font-heading font-semibold text-lg px-8 py-6"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Generate Q&A Pairs
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-accent">10M+</div>
              <div className="text-sm text-muted-foreground">Rows Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-accent">99.9%</div>
              <div className="text-sm text-muted-foreground">Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-accent">100%</div>
              <div className="text-sm text-muted-foreground">Privacy Compliant</div>
            </div>
          </div>
        </div>
        
        {/* Right Column - DNA Helix Visualization */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            {/* Glow Effect Behind DNA */}
            <div className="absolute inset-0 bg-gradient-accent opacity-30 blur-3xl rounded-full transform scale-150" />
            
            {/* DNA Helix */}
            <DNAHelix />
            
            {/* Floating Elements */}
            <div className="absolute top-10 -left-10 particle animate-float" style={{ animationDelay: '0s' }} />
            <div className="absolute top-32 -right-8 particle animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-20 -left-6 particle animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-40 right-12 particle animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground font-body">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;