import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogIn, UserPlus } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-20 w-20 text-primary" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Full-Stack Todo App
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Complete MERN-style application with authentication, database storage, and secure JWT tokens
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="group">
            <LogIn className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Login
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="group">
            <UserPlus className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Sign Up
          </Button>
        </div>

        <div className="pt-8 space-y-3">
          <h2 className="text-2xl font-semibold">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-bold text-primary">React</p>
              <p className="text-sm text-muted-foreground">Frontend</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-bold text-primary">PostgreSQL</p>
              <p className="text-sm text-muted-foreground">Database</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-bold text-primary">JWT Auth</p>
              <p className="text-sm text-muted-foreground">Security</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <p className="font-bold text-primary">TypeScript</p>
              <p className="text-sm text-muted-foreground">Type Safety</p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <h3 className="text-lg font-semibold mb-3">Features</h3>
          <div className="grid md:grid-cols-2 gap-3 text-left">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-card/50">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm">Secure user authentication with email & password</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-card/50">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm">JWT token-based session management</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-card/50">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm">CRUD operations on user-specific todos</span>
            </div>
            <div className="flex items-start gap-2 p-3 rounded-lg bg-card/50">
              <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
              <span className="text-sm">Row-level security for data isolation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
