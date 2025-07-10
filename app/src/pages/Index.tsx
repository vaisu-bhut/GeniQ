import Navigation from '@/components/Navigation';
import DashboardSection from '@/components/DashboardSection';
import TabularDataSection from '@/components/TabularDataSection';
import QAGeneratorSection from '@/components/QAGeneratorSection';
import AnalyticsSection from '@/components/AnalyticsSection';
import ContactSection from '@/components/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <DashboardSection />
      <TabularDataSection />
      <QAGeneratorSection />
      <AnalyticsSection />
      <ContactSection />
    </div>
  );
};

export default Index;
