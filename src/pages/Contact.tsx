
import MainLayout from "@/components/layouts/main-layout";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import ContactForm from "@/components/contact-form";

const Contact = () => {
  return (
    <MainLayout>
      <SiteHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Get In Touch</h1>
            <p className="text-xl text-muted-foreground">
              Ready to collaborate or need DevOps consultation? Let's connect!
            </p>
          </div>
          
          <Card>
            <ContactForm />
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
