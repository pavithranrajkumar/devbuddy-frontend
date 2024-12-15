import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FormFieldComponent } from "@/components/form/FormFieldComponent";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/ui/icons";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function Login() {
  const { login, isAuthenticating } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: FormData) => {
    try {
      await login(values.email, values.password);
      toast({
        title: "Success!",
        description: "Welcome back to DevBuddy",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Invalid credentials",
      });
    }
  };

  return (
    <div className="min-h-screen w-screen flex overflow-x-hidden">
      {/* Left side - Hero/Branding with enhanced styling */}
      <div className="hidden lg:flex lg:w-2/3 relative items-center justify-center bg-slate-900">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-slate-900/0"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>

        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 -top-24 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute -right-4 -bottom-24 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-16">
          <div className="mb-8">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
              <Icons.logo className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-7xl font-bold text-white mb-8 tracking-tight">
            Welcome to
            <br />
            DevBuddy
          </h1>
          <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
            Connect with top developers and bring your projects to life. Join
            our community of professionals today.
          </p>
        </div>
      </div>

      {/* Right side - Login Form with enhanced styling */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              DevBuddy
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Connect with top developers
            </p>
          </div>

          <Card className="shadow-none border-0 bg-white/50 dark:bg-slate-900">
            <CardHeader className="space-y-1 pb-8">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-base">
                Enter your credentials to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FormFieldComponent
                      form={form}
                      name="email"
                      label="Email"
                      placeholder="name@example.com"
                      type="email"
                    />

                    <FormFieldComponent
                      form={form}
                      name="password"
                      label="Password"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-muted-foreground"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-base font-medium"
                    disabled={isAuthenticating}
                  >
                    {isAuthenticating ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-11 bg-white dark:bg-slate-900"
                    >
                      <Icons.gitHub className="mr-2 h-4 w-4" />
                      GitHub
                    </Button>
                    <Button
                      variant="outline"
                      className="h-11 bg-white dark:bg-slate-900"
                    >
                      <Icons.google className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-medium text-primary hover:underline"
                    >
                      Create one
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
