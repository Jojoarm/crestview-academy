import { ClassesTab } from './_components/classes-tab';
import { ArmsTab } from './_components/arms-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ClassesPage() {
  return (
    <Tabs defaultValue="classes" className="flex flex-col gap-6">
      <TabsList className="bg-muted border border-border w-fit">
        <TabsTrigger
          value="classes"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Classes
        </TabsTrigger>
        <TabsTrigger
          value="arms"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Arms
        </TabsTrigger>
      </TabsList>

      <TabsContent value="classes" className="mt-0">
        <ClassesTab />
      </TabsContent>

      <TabsContent value="arms" className="mt-0">
        <ArmsTab />
      </TabsContent>
    </Tabs>
  );
}
