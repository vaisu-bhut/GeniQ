import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const FeatureCard = ({ icon: Icon, title, description, children, className = '', style }: FeatureCardProps) => {
  return (
    <div className={`group glass rounded-2xl p-6 hover:glow-accent transition-all duration-500 hover:-translate-y-2 ${className}`} style={style}>
      {/* Icon */}
      <div className="mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-background" />
        </div>
      </div>
      
      {/* Content */}
      <h3 className="font-heading font-semibold text-xl text-foreground mb-3 group-hover:text-accent transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground font-body mb-4 leading-relaxed">
        {description}
      </p>
      
      {/* Additional Content */}
      {children}
    </div>
  );
};

export default FeatureCard;