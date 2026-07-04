import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeeTypesTab } from './_components/fee-types-tab';
import { FeeStructuresTab } from './_components/fee-structures-tab';

export default function FeeStructuresPage() {
  return (
    <Tabs defaultValue="structures" className="flex flex-col gap-6">
      <TabsList className="bg-muted border border-border w-fit">
        <TabsTrigger
          value="structures"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Fee Structures
        </TabsTrigger>
        <TabsTrigger
          value="types"
          className="font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          Fee Types
        </TabsTrigger>
      </TabsList>

      <TabsContent value="structures" className="mt-0">
        <FeeStructuresTab />
      </TabsContent>

      <TabsContent value="types" className="mt-0">
        <FeeTypesTab />
      </TabsContent>
    </Tabs>
  );
}
