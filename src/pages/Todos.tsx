import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { LogOut, Plus, Trash2, Loader2 } from "lucide-react";
import { z } from "zod";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

const todoSchema = z.object({
  text: z.string().trim().min(1, "Todo cannot be empty").max(500, "Todo too long"),
});

const Todos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUserEmail(session.user.email || "");

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    await fetchTodos();

    return () => subscription.unsubscribe();
  };

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTodos(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch todos. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = todoSchema.safeParse({ text: newTodo });
    if (!validation.success) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validation.error.errors[0].message,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("todos")
        .insert([{ text: newTodo.trim(), user_id: session.user.id }])
        .select()
        .single();

      if (error) throw error;

      setTodos([data, ...todos]);
      setNewTodo("");
      toast({
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: !completed })
        .eq("id", id);

      if (error) throw error;

      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo. Please try again.",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: "Deleted",
        description: "Todo removed successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo. Please try again.",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        <Card className="shadow-2xl border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">My Todos</CardTitle>
                <CardDescription>
                  Logged in as: {userEmail}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground pt-2">
              <span>Total: {totalCount}</span>
              <span>Completed: {completedCount}</span>
              <span>Pending: {totalCount - completedCount}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={addTodo} className="flex gap-2">
              <Input
                placeholder="Add a new todo..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No todos yet. Add your first one above!
                </div>
              ) : (
                todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                    />
                    <span
                      className={`flex-1 ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Full-stack MERN-style app built with React + PostgreSQL + JWT</p>
          <p className="mt-2">✓ User Authentication ✓ Database Storage ✓ Secure API</p>
        </div>
      </div>
    </div>
  );
};

export default Todos;