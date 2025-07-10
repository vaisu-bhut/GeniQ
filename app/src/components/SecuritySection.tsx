import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  FileText,
  Clock,
  Activity
} from 'lucide-react';

const SecuritySection = () => {
  const [guardRailSettings, setGuardRailSettings] = useState({
    anonymizeData: true,
    balanceDemographics: true,
    contentModeration: true,
    biasDetection: true,
  });

  const [violations, setViolations] = useState([
    { type: 'PII Detected', time: '2 min ago', status: 'resolved', severity: 'high' },
    { type: 'Bias Found', time: '15 min ago', status: 'resolved', severity: 'medium' },
    { type: 'Content Flag', time: '1 hour ago', status: 'reviewing', severity: 'low' },
  ]);

  const complianceStandards = [
    { name: 'GDPR', status: 'compliant', description: 'General Data Protection Regulation' },
    { name: 'HIPAA', status: 'compliant', description: 'Health Insurance Portability and Accountability Act' },
    { name: 'PCI DSS', status: 'compliant', description: 'Payment Card Industry Data Security Standard' },
    { name: 'SOC 2', status: 'compliant', description: 'Service Organization Control 2' },
  ];

  const [riskScore, setRiskScore] = useState(15);

  const toggleSetting = (setting: string) => {
    setGuardRailSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <section id="security" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-gradient">Security &</span>
            <span className="text-foreground"> Guardrails</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive protection with real-time monitoring and ethical AI safeguards
          </p>
        </div>

        {/* Compliance Shield */}
        <div className="mb-16">
          <Card className="glass">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <Shield className="w-20 h-20 text-accent mx-auto mb-4 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-glow rounded-full blur-xl opacity-50"></div>
                </div>
                <h3 className="text-2xl font-heading font-bold mb-2">Compliance Shield Active</h3>
                <div className="text-lg text-muted-foreground">Risk Level: 
                  <span className={`ml-2 font-semibold ${riskScore < 20 ? 'text-accent' : riskScore < 50 ? 'text-yellow-400' : 'text-destructive'}`}>
                    {riskScore < 20 ? 'Low' : riskScore < 50 ? 'Medium' : 'High'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {complianceStandards.map((standard, index) => (
                  <div 
                    key={index} 
                    className="text-center p-4 border border-border rounded-lg hover:border-accent/50 transition-all hover:scale-105 cursor-pointer group"
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        standard.status === 'compliant' ? 'bg-accent/20' : 'bg-destructive/20'
                      }`}>
                        {standard.status === 'compliant' ? (
                          <CheckCircle className="w-6 h-6 text-accent" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-destructive" />
                        )}
                      </div>
                      {standard.status === 'compliant' && (
                        <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full animate-ping"></div>
                      )}
                    </div>
                    <div className="font-semibold mb-1">{standard.name}</div>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {standard.description}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-accent">
                  <Activity className="w-5 h-5 animate-pulse" />
                  <span className="font-medium">Real-time Compliance Monitoring Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Guardrail Activity Feed */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent" />
                Guardrail Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {violations.map((violation, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-accent/50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    violation.severity === 'high' ? 'bg-destructive' :
                    violation.severity === 'medium' ? 'bg-yellow-400' : 'bg-blue-400'
                  } animate-pulse`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {violation.type === 'PII Detected' && <Lock className="w-4 h-4 text-destructive" />}
                      {violation.type === 'Bias Found' && <Scale className="w-4 h-4 text-yellow-400" />}
                      {violation.type === 'Content Flag' && <Eye className="w-4 h-4 text-blue-400" />}
                      <span className="font-medium">{violation.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{violation.time}</div>
                  </div>
                  
                  <Badge 
                    className={
                      violation.status === 'resolved' ? 'bg-accent/20 text-accent' :
                      'bg-yellow-400/20 text-yellow-400'
                    }
                  >
                    {violation.status}
                  </Badge>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Audit Trail
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ethics Configuration */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-accent" />
                Ethics Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <EyeOff className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Anonymize Data</div>
                      <div className="text-sm text-muted-foreground">Remove personal identifiers</div>
                    </div>
                  </div>
                  <Switch 
                    checked={guardRailSettings.anonymizeData}
                    onCheckedChange={() => toggleSetting('anonymizeData')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Balance Demographics</div>
                      <div className="text-sm text-muted-foreground">Ensure fair representation</div>
                    </div>
                  </div>
                  <Switch 
                    checked={guardRailSettings.balanceDemographics}
                    onCheckedChange={() => toggleSetting('balanceDemographics')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Content Moderation</div>
                      <div className="text-sm text-muted-foreground">Filter inappropriate content</div>
                    </div>
                  </div>
                  <Switch 
                    checked={guardRailSettings.contentModeration}
                    onCheckedChange={() => toggleSetting('contentModeration')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium">Bias Detection</div>
                      <div className="text-sm text-muted-foreground">Monitor for unfair patterns</div>
                    </div>
                  </div>
                  <Switch 
                    checked={guardRailSettings.biasDetection}
                    onCheckedChange={() => toggleSetting('biasDetection')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Security Status</div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                    <span className="text-accent font-medium">All Systems Secure</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Risk Monitor */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              Real-time Risk Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-accent rounded-full opacity-20 animate-ping"></div>
                  <div className="relative w-full h-full bg-gradient-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-bold text-lg">{riskScore}</span>
                  </div>
                </div>
                <div className="font-semibold mb-1">Risk Score</div>
                <div className="text-sm text-muted-foreground">Current threat level</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-pulse"></div>
                  <div className="relative w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-foreground" />
                  </div>
                </div>
                <div className="font-semibold mb-1">Compliance</div>
                <div className="text-sm text-muted-foreground">100% adherent</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-secondary rounded-full opacity-20 animate-bounce"></div>
                  <div className="relative w-full h-full bg-gradient-secondary rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-secondary-foreground" />
                  </div>
                </div>
                <div className="font-semibold mb-1">Uptime</div>
                <div className="text-sm text-muted-foreground">99.9% available</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SecuritySection;