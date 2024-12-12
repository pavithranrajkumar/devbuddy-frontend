import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfo } from "./PersonalInfo";
import { SkillsSection } from "./SkillsSection";

export function ProfilePage() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information and visibility
        </p>
      </div>

      <Tabs defaultValue="personal">
        <div className="border-b">
          <TabsList className="h-10 bg-transparent space-x-6">
            <TabsTrigger
              value="personal"
              className="relative h-10 rounded-none border-b-2 border-b-transparent bg-white data-[state=active]:border-b-primary data-[state=active]:shadow-none hover:border-b-muted-foreground focus:outline-none focus-visible:outline-none focus-within:outline-none ring-0 focus:ring-0"
            >
              Personal Info
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal">
          <PersonalInfo />
        </TabsContent>
        <TabsContent value="skills">
          <SkillsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
