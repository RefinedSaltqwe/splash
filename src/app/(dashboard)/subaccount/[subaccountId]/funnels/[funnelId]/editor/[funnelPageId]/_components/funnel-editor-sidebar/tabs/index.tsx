import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";

const TabList = () => {
  return (
    <TabsList className=" flex h-fit w-full flex-col items-center justify-evenly gap-4 bg-transparent ">
      <TabsTrigger
        value="Settings"
        className="h-10 w-10 p-0 data-[state=active]:bg-muted-foreground/5"
      >
        <SettingsIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Components"
        className="h-10 w-10 p-0 data-[state=active]:bg-muted-foreground/5"
      >
        <Plus />
      </TabsTrigger>

      <TabsTrigger
        value="Layers"
        className="h-10 w-10 p-0 data-[state=active]:bg-muted-foreground/5"
      >
        <SquareStackIcon />
      </TabsTrigger>
      <TabsTrigger
        value="Media"
        className="h-10 w-10 p-0 data-[state=active]:bg-muted-foreground/5"
      >
        <Database />
      </TabsTrigger>
    </TabsList>
  );
};

export default TabList;
