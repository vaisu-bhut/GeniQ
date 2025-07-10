import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Star,
  Code, 
  Info,
  User,
  Building
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    rating: 5,
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiData, setShowApiData] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feedback', label: 'Product Feedback' }
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      email: "sarah@geniq.ai",
      avatar: "SC",
      description: "Product strategy and roadmap"
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead Developer",
      email: "marcus@geniq.ai",
      avatar: "MR",
      description: "Technical architecture and development"
    },
    {
      name: "Dr. Emily Watson",
      role: "AI Research Lead",
      email: "emily@geniq.ai",
      avatar: "EW",
      description: "Machine learning and data science"
    },
    {
      name: "Alex Kim",
      role: "UX Designer",
      email: "alex@geniq.ai",
      avatar: "AK",
      description: "User experience and interface design"
    }
  ];

  const getApiRequest = () => ({
    name: formData.name,
    email: formData.email,
    company: formData.company,
    message: formData.message,
    rating: formData.rating,
    category: formData.category,
    timestamp: new Date().toISOString(),
    source: 'web_contact_form'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const request = getApiRequest();
      const response = await apiService.submitFeedback(request);
      
      if (response.success) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your feedback. We'll get back to you soon.",
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          rating: 5,
          category: 'general'
        });
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.name && formData.email && formData.message;

  return (
    <section id="contact" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-gradient">Get in</span>
            <span className="text-foreground"> Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Send us a Message
              </CardTitle>
            </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name *</label>
                      <Input
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email *</label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Company</label>
                    <Input
                      placeholder="Your company (optional)"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 bg-input border border-border rounded-md text-foreground"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({...formData, rating: star})}
                          className={`p-1 rounded transition-colors ${
                            star <= formData.rating 
                              ? 'text-yellow-400 hover:text-yellow-300' 
                              : 'text-muted-foreground hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-5 h-5" fill={star <= formData.rating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Message *</label>
                    <textarea
                      placeholder="Tell us about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full p-3 bg-input border border-border rounded-md text-foreground resize-none"
                      required
                    />
                  </div>

                  {/* API Data Preview */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-accent" />
                        API Request Preview
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowApiData(!showApiData)}
                        >
                          {showApiData ? 'Hide' : 'Show'} Data
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {showApiData && (
                        <div className="space-y-4">
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <pre className="text-xs text-muted-foreground overflow-x-auto">
                              {JSON.stringify(getApiRequest(), null, 2)}
                            </pre>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="w-4 h-4" />
                            This is the exact data being sent to the API
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit"
                    className="w-full bg-gradient-primary text-primary-foreground text-lg py-6 hover:scale-105 transition-transform"
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6 mr-3" />
                        Send Message
                      </>
                    )}
                    </Button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {isValid ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span className="text-accent">Form is valid</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span className="text-destructive">Please fill required fields</span>
                      </>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Team & Contact Info */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-accent" />
                  Our Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-border rounded-lg hover:border-accent/50 transition-colors">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent font-semibold">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                        <div className="text-xs text-accent">{member.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
            </CardContent>
          </Card>

            {/* Contact Information */}
          <Card className="glass">
            <CardHeader>
                <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">hello@geniq.ai</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm text-muted-foreground">
                      123 AI Street<br />
                      Tech Valley, CA 94000
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">General Inquiries</span>
                    <Badge variant="outline">24-48 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical Support</span>
                    <Badge variant="outline">4-8 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Bug Reports</span>
                    <Badge variant="outline">2-4 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Feature Requests</span>
                    <Badge variant="outline">1-2 weeks</Badge>
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

export default ContactSection;