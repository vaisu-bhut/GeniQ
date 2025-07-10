import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Shield, 
  Star, 
  Send, 
  Users, 
  Code, 
  Brain,
  Mail
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const team = [
    { name: 'Dr. Sarah Chen', role: 'AI Research Lead', specialty: 'Machine Learning', avatar: '👩‍🔬' },
    { name: 'Marcus Rodriguez', role: 'Data Architect', specialty: 'Synthetic Data', avatar: '👨‍💻' },
    { name: 'Aisha Patel', role: 'Security Engineer', specialty: 'Privacy & Ethics', avatar: '👩‍💼' },
  ];

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide a rating before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const datasetId = `feedback_${Date.now()}`;
      const improvements = feedback.toLowerCase().includes('improve') ? 
        ['Better UI/UX', 'More data formats', 'Faster generation'] : [];

      await apiService.submitFeedback(
        datasetId,
        rating,
        feedback,
        improvements
      );

      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your feedback. We'll use it to improve our service.",
      });

      // Reset form
      setRating(0);
      setFeedback('');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            <span className="text-gradient">Contact</span>
            <span className="text-foreground"> Us</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with our team of experts and help shape the future of synthetic data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Team Holograms */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Meet Our Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {team.map((member, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 border border-border rounded-lg hover:border-accent/50 transition-all hover:scale-105 cursor-pointer group"
                >
                  <div className="text-4xl animate-bounce">{member.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-heading font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <div className="text-xs text-accent">{member.specialty}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Support Channels */}
          <Card className="glass">
            <CardHeader>
              <CardTitle>Get Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-gradient-accent text-accent-foreground">
                <MessageSquare className="w-5 h-5 mr-3 animate-pulse" />
                Live Chat Available
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-5 h-5 mr-3" />
                Emergency Support
              </Button>
              
              <div className="pt-4">
                <h4 className="font-semibold mb-3">Feedback Portal</h4>
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 cursor-pointer transition-colors ${
                          star <= rating ? 'text-accent fill-accent' : 'text-muted-foreground'
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                  
                  <Textarea
                    placeholder="Suggest a feature or share your feedback..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[100px]"
                  />
                  
                  <Button 
                    className="w-full bg-gradient-primary"
                    onClick={handleSubmitFeedback}
                    disabled={isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Send Feedback'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;